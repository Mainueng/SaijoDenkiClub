import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ErrorCodeScreen from "./ErrorCodeScreen";
import ErrorCodeDescriptionScreen from "./ErrorCodeDescription";
import { normalize } from "../../components/font";

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
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(18) > 24 ? 24 : normalize(18),
          },
          headerTitleAlign: "center",
          title: "รหัสความผิดปกติ",
        }}
      />
      <Stack.Screen
        name="ErrorCodeDescription"
        component={ErrorCodeDescriptionScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(18) > 24 ? 24 : normalize(18),
          },
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
export default ErrorCodeRootScreen;
