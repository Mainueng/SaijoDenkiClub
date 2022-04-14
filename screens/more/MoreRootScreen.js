import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MoreScreen from "./MoreScreen";

const MoreRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="More"
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
        name="More"
        component={MoreScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
          title: "อื่นๆ",
        }}
      />
    </Stack.Navigator>
  );
};
export default MoreRootScreen;
