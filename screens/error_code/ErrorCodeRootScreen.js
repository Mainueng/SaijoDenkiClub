import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ErrorCodeScreen from "./ErrorCodeScreen";
import ErrorCodeDescriptionScreen from "./ErrorCodeDescription";

const ErrorCodeRootScreen = () => {
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
      <Stack.Screen
        name="ErrorCodeDescription"
        component={ErrorCodeDescriptionScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
    </Stack.Navigator>
  );
};
export default ErrorCodeRootScreen;
