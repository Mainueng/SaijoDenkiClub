import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef, useContext } from "react";
import { TabContext } from "./tab_context";
import { useNavigation } from "@react-navigation/native";
// import { read_notification, notification_list } from "../api/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PushNotification = () => {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { update_badge } = useContext(TabContext);

  const navigation = useNavigation();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        update_badge(
          notification.request.content.badge > 99
            ? "99+"
            : notification.request.content.badge
        );
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (
          response.notification.request.content.data.notification_type ===
          "news_and_promotion"
        ) {
          (async () => {
            let data = await readNotification(
              parseInt(
                response.notification.request.content.data.notification_id
              )
            );

            update_badge(data);

            if (data > 99) {
              data = "99+";
            }

            Notifications.setBadgeCountAsync(data);
          })();

          navigation.navigate("NotificationInfoScreen", {
            name: response.notification.request.content.data.title,
            params: {
              id: parseInt(
                response.notification.request.content.data.notification_id
              ),
              format: parseInt(
                response.notification.request.content.data.format
              ),
            },
          });
        } else if (
          response.notification.request.content.data.notification_type ===
          "activity"
        ) {
          navigation.navigate("Booking", {
            screen: "BookingListScreen",
            params: {
              job_id: response.notification.request.content.data.job_id,
            },
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null;
};

const readNotification = async (id) => {
  let count = 0;

  try {
    let token = await AsyncStorage.getItem("token");

    // try {
    //   await read_notification(token, id);
    //   let notification = await notification_list(token);

    //   notification.data.data.map((item) => {
    //     if (item.status === "1") {
    //       count++;
    //     }
    //   });

    // } catch (error) {
    //   console.log(error);
    // }
  } catch (error) {
    console.log(error);
  }

  return count;
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@phanat/saijo_denki_connect",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export { PushNotification, registerForPushNotificationsAsync };
