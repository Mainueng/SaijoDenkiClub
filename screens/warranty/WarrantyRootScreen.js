import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WarrantyScreen from "./WarrantyScreen";
import WarrantyInfoScreen from "./WarrantyInfoScreen";
import { normalize } from "../../components/font";

const NotificationRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Warranty"
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
        name="Warranty"
        component={WarrantyScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(16) > 22 ? 22 : normalize(16),
          },
          title: "E-Warranty",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="WarrantyInfo"
        component={WarrantyInfoScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(16) > 22 ? 22 : normalize(16),
          },
          title: "E-Warranty",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationRootScreen;
