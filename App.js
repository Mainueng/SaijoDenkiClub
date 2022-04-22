import React, { useEffect, useReducer, useState, useMemo } from "react";
import {
  View,
  Alert,
  Image,
  Text,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from "./components/font";
import jwt_decode from "jwt-decode";
import {
  PushNotification,
  registerForPushNotificationsAsync,
} from "./components/push_notification";
import { AuthContext } from "./components/context";
import { TabContext } from "./components/tab_context";
import { apple_auth, check_version, facebook_auth, sign_in } from "./api/auth";
import styles from "./assets/stylesheet/auth/auth";

import SignInRootScreen from "./screens/auth/SignInRootScreen";
import HomeRootScreen from "./screens/home/HomeRootScreen";
import NotificationRootScreen from "./screens/notification/NotificationRootScreen";
import WarrantyRootScreen from "./screens/warranty/WarrantyRootScreen";
import ErrorCodeRootScreen from "./screens/error_code/ErrorCodeRootScreen";
import MoreRootScreen from "./screens/more/MoreRootScreen";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const [badge, setBadge] = useState(0);
  const [modalData, setModalData] = useState({});

  const update_badge = (count) => {
    setBadge(count);
  };

  return (
    <TabContext.Provider value={{ update_badge, modalData, setModalData }}>
      <PushNotification />
      <Tab.Navigator
        initialRouteName="HomeRootScreen"
        screenOptions={{
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#ffffff",
          tabBarActiveBackgroundColor: "#b31117",
          tabBarInactiveBackgroundColor: "#b31117",
          tabBarStyle: {
            fontFamily: "Sukhumvit_Medium",
          },
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#b31117",
          },
        }}
      >
        <Tab.Screen
          name="HomeRootScreen"
          component={HomeRootScreen}
          options={{
            tabBarLabel: "หน้าแรก",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="home"
                color={color}
                size={size * 0.9}
              />
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
              fontSize: normalize(10) > 14 ? 14 : normalize(10),
              fontFamily: "Sukhumvit_Medium",
            },
          }}
        />
        <Tab.Screen
          name="NotificationRootScreen"
          component={NotificationRootScreen}
          options={{
            tabBarLabel: "การแจ้งเตือน",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="bell"
                color={color}
                size={size * 0.9}
              />
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
              fontSize: normalize(10) > 14 ? 14 : normalize(10),
              fontFamily: "Sukhumvit_Medium",
            },
            tabBarBadge: badge,
            tabBarBadgeStyle: {
              backgroundColor: "#11B3AD",
              color: "#ffffff",
              fontSize: normalize(10) > 14 ? 14 : normalize(10),
              position: "absolute",
              top: "-30%",
              left: 0,
              display: badge ? "flex" : "none",
            },
          }}
        />
        <Tab.Screen
          name="WarrantyRootScreen"
          component={WarrantyRootScreen}
          options={{
            tabBarLabel: "E-Warranty",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="qrcode-scan"
                color={color}
                size={size * 0.9}
              />
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
              fontSize: normalize(10) > 14 ? 14 : normalize(10),
              fontFamily: "Sukhumvit_Medium",
            },
          }}
        />
        <Tab.Screen
          name="ErrorRootScreen"
          component={ErrorCodeRootScreen}
          options={{
            tabBarLabel: "รหัสความผิดปกติ",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="alert-circle"
                color={color}
                size={size * 0.9}
              />
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
              fontSize: normalize(10) > 14 ? 14 : normalize(10),
              fontFamily: "Sukhumvit_Medium",
            },
          }}
        />
        <Tab.Screen
          name="MoreRootScreen"
          component={MoreRootScreen}
          options={{
            tabBarLabel: "อื่นๆ",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="dots-horizontal"
                color={color}
                size={size * 0.9}
              />
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
              fontSize: normalize(10) > 14 ? 14 : normalize(10),
              fontFamily: "Sukhumvit_Medium",
            },
          }}
        />
      </Tab.Navigator>
    </TabContext.Provider>
  );
};

const App = () => {
  const [loaded] = useFonts({
    Sukhumvit_Light: require("./assets/fonts/SukhumvitSet-Light.ttf"),
    Sukhumvit_Text: require("./assets/fonts/SukhumvitSet-Text.ttf"),
    Sukhumvit_Medium: require("./assets/fonts/SukhumvitSet-Medium.ttf"),
    Sukhumvit_SemiBold: require("./assets/fonts/SukhumvitSet-SemiBold.ttf"),
    Sukhumvit_Bold: require("./assets/fonts/SukhumvitSet-Bold.ttf"),
  });
  const [text, setText] = useState("Loading");
  const [process, setProcess] = useState(false);

  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(
    () => ({
      login: async (username, password) => {
        let token = null;
        setProcess(true);

        let device_id = null;

        try {
          registerForPushNotificationsAsync().then(
            async (push_notification_token) => {
              device_id = push_notification_token;

              try {
                await AsyncStorage.setItem(
                  "push_notification_token",
                  device_id
                );
              } catch (error) {
                console.log(error);
              }

              try {
                token = await sign_in(username, password, device_id);

                try {
                  await AsyncStorage.setItem(
                    "token",
                    token.data.data[0].auth_token
                  );
                  dispatch({ type: "LOGIN", token: token });
                } catch (error) {
                  console.log(error);
                }

                setProcess(false);
              } catch (error) {
                setProcess(false);
                console.log(username, password, device_id);
                Alert.alert(error.response.data.message);
              }
            }
          );
        } catch (error) {
          console.log(error);
          setProcess(false);
        }
      },
      facebook: async (facebook_token) => {
        let token = null;
        setProcess(true);

        let device_id = null;

        try {
          registerForPushNotificationsAsync().then(
            async (push_notification_token) => {
              device_id = push_notification_token;

              try {
                await AsyncStorage.setItem(
                  "push_notification_token",
                  device_id
                );
              } catch (error) {
                console.log(error);
              }

              try {
                token = await facebook_auth(facebook_token, device_id);

                try {
                  await AsyncStorage.setItem(
                    "token",
                    token.data.data[0].auth_token
                  );
                  dispatch({ type: "LOGIN", token: token });
                } catch (error) {
                  console.log(error);
                }

                setProcess(false);
              } catch (error) {
                setProcess(false);
                console.log(facebook_token, device_id);
                Alert.alert(error.response.data.message);
              }
            }
          );
        } catch (error) {
          console.log(error);
          setProcess(false);
        }
      },
      apple: async (identityToken, first_name, last_name) => {
        let token = null;
        setProcess(true);

        let device_id = null;

        try {
          registerForPushNotificationsAsync().then(
            async (push_notification_token) => {
              device_id = push_notification_token;

              try {
                await AsyncStorage.setItem(
                  "push_notification_token",
                  device_id
                );
              } catch (error) {
                console.log(error);
              }

              try {
                let decode = jwt_decode(identityToken);

                token = await apple_auth(
                  decode.email,
                  first_name === null ? "" : first_name,
                  last_name === null ? "" : last_name,
                  device_id
                );

                try {
                  await AsyncStorage.setItem(
                    "token",
                    token.data.data[0].auth_token
                  );
                  setProcess(false);
                  dispatch({ type: "LOGIN", token: token });
                } catch (error) {
                  console.log(error);
                  setProcess(false);
                }
              } catch (error) {
                setProcess(false);

                //console.log(error.response.data.message);
                Alert.alert(error.response.data.message);
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.removeItem("token");
        } catch (error) {
          console.log(error);
        }

        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  useEffect(() => {
    let i = 0;
    let loading_text = "Loading";

    let loading = setInterval(() => {
      if (i > 2) {
        loading_text = "Loading";
        i = 0;
      } else {
        loading_text = loading_text + ".";
        i++;
      }
      setText(loading_text);
    }, 500);

    setTimeout(async () => {
      let token = null;
      setProcess(true);
      clearInterval(loading);

      try {
        token = await AsyncStorage.getItem("token");

        if (Platform.OS === "ios") {
          version = "4.1.1";
        } else {
          version = "4.1.1";
        }

        try {
          let res = await check_version(Platform.OS, version);

          if (!res.data.status) {
            Alert.alert("โปรดอัปเดตเวอร์ชันใหม่", "", [
              {
                text: "ยกเลิก",
              },
              {
                text: "อัพเดต",
                onPress: () => openUrl(),
              },
            ]);
          }

          if (token) {
            let decode = jwt_decode(token);
            if (new Date(decode.time * 1000).getTime < new Date().getTime) {
              token = null;
            }
            setProcess(false);
            dispatch({ type: "RETRIEVE_TOKEN", token: token });
          } else {
            setProcess(false);
            dispatch({ type: "RETRIEVE_TOKEN", token: null });
          }
        } catch (error) {
          Alert.alert("โปรดอัปเดตเวอร์ชันใหม่", "", [
            {
              text: "ยกเลิก",
            },
            {
              text: "อัพเดต",
              onPress: () => openUrl(),
            },
          ]);
        }
      } catch (error) {
        setProcess(false);
        dispatch({ type: "RETRIEVE_TOKEN", token: null });
        console.log(error);
      }
    }, 2000);
  }, []);

  const openUrl = () => {
    (async () => {
      if (Platform.OS === "ios") {
        url = "https://apps.apple.com/th/app/saijo-denki-app/id966825034";
      } else {
        url =
          "https://play.google.com/store/apps/details?id=app.saijo.saijo_denki_air_con";
      }

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Can't open open link!`);
      }
    })();
  };

  if (!loaded) {
    return null;
  }

  if (loginState.isLoading) {
    return (
      <View style={styles.loading}>
        <StatusBar style="dark" />
        <Image
          source={require("./assets/image/auth/logo.png")}
          style={styles.loading_logo}
          resizeMode="contain"
        />
        <Text style={styles.loading_text}>{text}</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <View
          style={
            process
              ? styles.processing_bg
              : { height: process ? "100%" : 0, opacity: process ? 1 : 0 }
          }
        >
          <View style={styles.processing_container}>
            <ActivityIndicator size="large" color="#999999" />
            <Text style={styles.processing_text}>Loading...</Text>
          </View>
        </View>
        {loginState.userToken !== null ? <Tabs /> : <SignInRootScreen />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
