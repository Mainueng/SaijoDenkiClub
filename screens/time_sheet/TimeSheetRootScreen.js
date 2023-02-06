import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { normalize } from "../../components/font";
import TimeSheetScreen from "./TimeSheetScreen";

const TimeSheetRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="TimeSheetSheet"
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
        name="TimeSheetSheet"
        component={TimeSheetScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(16) > 22 ? 22 : normalize(16),
          },
          headerTitleAlign: "center",
          title: "ตารางเวลา",
        }}
      />
    </Stack.Navigator>
  );
};

export default TimeSheetRootScreen;
