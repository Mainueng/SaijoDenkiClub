import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MoreScreen from "./MoreScreen";
import { normalize } from "../../components/font";

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
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(18) > 24 ? 24 : normalize(18),
          },
          title: "อื่นๆ",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
export default MoreRootScreen;
