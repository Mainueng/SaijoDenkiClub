import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import { normalize } from "../../components/font";

const SignInRootScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Sign In"
      screenOptions={{
        headerMode: "screen",
        headerTintColor: "#ffffff",
        headerStyle: { backgroundColor: "#b31117" },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{
          headerShown: true,
          title: "สมัครสมาชิก",
          headerTitleStyle: {
            fontFamily: "Sukhumvit_SemiBold",
            fontSize: normalize(18) > 24 ? 24 : normalize(18),
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Forgot Password"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          title: "ลืมรหัสผ่าน",
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

export default SignInRootScreen;
