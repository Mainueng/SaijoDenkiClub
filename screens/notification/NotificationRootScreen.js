import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotificationScreen from "./NotificationScreen";
import { normalize } from "../../components/font";

const NotificationRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Notification"
      screenOptions={{
        headerMode: "screen",
        headerTintColor: "#ffffff",
        headerStyle: {
          backgroundColor: "#b31117",
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(18) > 24 ? 24 : normalize(18),
          },
          headerTitleAlign: "center",
          title: "การแจ้งเตือน",
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationRootScreen;
