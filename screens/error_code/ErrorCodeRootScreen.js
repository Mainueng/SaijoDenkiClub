import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ErrorCodeScreen from "./ErrorCodeScreen";

const NotificationRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ErrorCode"
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
        name="ErrorCode"
        component={ErrorCodeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default NotificationRootScreen;
