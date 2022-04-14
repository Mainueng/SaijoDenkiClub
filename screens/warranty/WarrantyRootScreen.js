import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WarrantyScreen from "./WarrantyScreen";
import WarrantyInfoScreen from "./WarrantyInfoScreen";

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
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
          title: "E-Warranty",
        }}
      />
      <Stack.Screen
        name="WarrantyInfo"
        component={WarrantyInfoScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
          title: "E-Warranty",
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationRootScreen;
