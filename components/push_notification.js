import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef, useContext } from "react";
import { TabContext } from "./tab_context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notifications } from "../api/notification";

const PushNotification = () => {
  // const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { update_badge, setModalData } = useContext(TabContext);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        update_badge(
          notification.request.content.badge > 99
            ? "99+"
            : notification.request.content.badge
        );

        if (notification.request.content.data.job_id !== undefined) {
          setModalData({
            openModal: true,
            jobID: notification.request.content.data.job_id,
            review: 0,
          });
        }

        (async () => {
          try {
            let token = await AsyncStorage.getItem("token");
            let res = await notifications(token);

            let count = 0;

            res.data.data.map((item) => {
              if (item.status === "1") {
                count++;
              }
            });

            Notifications.setBadgeCountAsync(count);
            update_badge(count);
          } catch (error) {
            console.log(error);
          }
        })();
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (response.notification.request.content.data.job_id !== undefined) {
          setModalData({
            openModal: true,
            jobID: response.notification.request.content.data.job_id,
            review: 0,
          });
        }

        (async () => {
          try {
            let token = await AsyncStorage.getItem("token");
            let res = await notifications(token);

            let count = 0;

            res.data.data.map((item) => {
              if (item.status === "1") {
                count++;
              }
            });

            Notifications.setBadgeCountAsync(count);
            update_badge(count);
          } catch (error) {
            console.log(error);
          }
        })();
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
