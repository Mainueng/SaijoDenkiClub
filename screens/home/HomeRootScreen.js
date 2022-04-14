import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import RecommendScreen from "./RecommendScreen";
import JobLocationScreen from "./JobLocationScreen";
import SummaryScreen from "./SummaryScreen";
import ReportScreen from "./ReportScreen";
import ReviewScreen from "./ReviewScreen";
import ProfileScreen from "./ProfileScreen";

const HomeRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Recommend"
        component={RecommendScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="Job Location"
        component={JobLocationScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          headerShown: true,
          title: "สรุปงาน: รายงานผลการตรวจสอบบริการ",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          headerShown: true,
          title: "รายงาน: รายงานผลการตรวจสอบบริการ",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          headerShown: true,
          title: "แบบประเมิน: ความพึงพอใจสินค้าและบริการ",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: "บัญชีผู้ใช้",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeRootScreen;
