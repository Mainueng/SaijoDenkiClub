import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import RecommendScreen from "./RecommendScreen";
import JobLocationScreen from "./JobLocationScreen";
import SummaryScreen from "./SummaryScreen";
import ReportScreen from "./ReportScreen";
import ReviewScreen from "./ReviewScreen";
import ProfileScreen from "./ProfileScreen";
import ProfileNameScreen from "./ProfileNameScreen";
import ProfilePhoneNumberScreen from "./ProfilePhoneNumberScreen";
import ProfileAddressScreen from "./ProfileAddressScreen";
import ProfileLocationScreen from "./ProfileLocationScreen";
import VerifyScreen from "./VerifyScreen";
import VerifyIdScreen from "./VerifyIdScreen";
import VerifyBookBankScreen from "./VerifyBookBankScreen";

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
      <Stack.Screen
        name="ProfileName"
        component={ProfileNameScreen}
        options={{
          headerShown: true,
          title: "บัญชีผู้ใช้",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="ProfilePhoneNumber"
        component={ProfilePhoneNumberScreen}
        options={{
          headerShown: true,
          title: "บัญชีผู้ใช้",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="ProfileAddress"
        component={ProfileAddressScreen}
        options={{
          headerShown: true,
          title: "บัญชีผู้ใช้",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="ProfileLocation"
        component={ProfileLocationScreen}
        options={{
          headerShown: true,
          title: "ตำแหน่ง",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="SaijoVerify"
        component={VerifyScreen}
        options={{
          headerShown: true,
          title: "Saijo Denki Verify",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="VerifyID"
        component={VerifyIdScreen}
        options={{
          headerShown: true,
          title: "บัตรประชาชน",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
      <Stack.Screen
        name="VerifyBookBank"
        component={VerifyBookBankScreen}
        options={{
          headerShown: true,
          title: "เลขที่บัญชี",
          headerTitleStyle: { fontFamily: "Sukhumvit_SemiBold" },
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeRootScreen;
