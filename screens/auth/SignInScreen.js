import React, { useContext, useState } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../components/context";
import { LinearGradient } from "expo-linear-gradient";
import * as Facebook from "expo-facebook";
import * as AppleAuthentication from "expo-apple-authentication";

import styles from "../../assets/stylesheet/auth/auth";
import { normalize } from "../../components/font";

const SignInScreen = ({ navigation }) => {
  const [data, setData] = useState({
    username: "",
    password: "",
    isValidUser: true,
    isValidPassword: true,
  });

  const { login, facebook, apple } = useContext(AuthContext);

  const login_facebook = async () => {
    try {
      Facebook.initializeAsync({
        appId: "1022758658679522",
        appName: "Saijo Denli Club V3",
      });

      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });

      if (type == "success") {
        facebook(token);
      } else {
        facebook("");
      }
    } catch ({ message }) {
      Alert.alert(`Facebook Login Error: ${message}`);
    }
  };

  const handle_username_change = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        username: val,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        isValidUser: false,
      });
    }
  };

  const handle_password_change = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const loginHandle = (username, password) => {
    if (data.username.length == 0) {
      Alert.alert("ผิดพลาด!", "กรุณาระบุอีเมล์.", [{ text: "ปิด" }]);

      return;
    }

    if (data.password.length == 0) {
      Alert.alert("ผิดพลาด!", "กรุณาระบุรหัสผ่าน.", [{ text: "ปิด" }]);

      return;
    }

    login(username, password);
  };

  return (
    <View>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#ffffff", "rgba(204,204,204, 0.1)"]}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.signin_container}
        >
          <Image
            source={require("../../assets/image/auth/logo.png")}
            style={styles.login_logo}
            resizeMode="contain"
          />
          <View style={styles.input_container}>
            <View style={styles.input_icon_container}>
              <MaterialCommunityIcons
                name="account"
                color="#b31117"
                size={normalize(22) > 28 ? 28 : normalize(22)}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="อีเมล์"
              placeholderTextColor="rgba(102,102,102,0.5)"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(val) => handle_username_change(val)}
            />
          </View>
          <View style={styles.input_container}>
            <View style={styles.input_icon_container}>
              <MaterialCommunityIcons
                name="lock"
                color="#b31117"
                size={normalize(22) > 28 ? 28 : normalize(22)}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="รหัสผ่าน"
              placeholderTextColor="rgba(102,102,102,0.5)"
              secureTextEntry={true}
              onChangeText={(val) => handle_password_change(val)}
            />
          </View>
          <View style={styles.other_container}>
            <Pressable
              style={styles.signup_container}
              onPress={() => navigation.navigate("Sign Up")}
            >
              <Text style={styles.signup_text}>สมัครสมาชิก</Text>
            </Pressable>
            <Pressable
              style={styles.forget_password_container}
              onPress={() => navigation.navigate("Forgot Password")}
            >
              <Text style={styles.forgot_password}>ลืมรหัสผ่าน ?</Text>
            </Pressable>
          </View>
          <View style={styles.btn_container}>
            <Pressable
              style={styles.login_btn}
              onPress={() => {
                Keyboard.dismiss(), loginHandle(data.username, data.password);
              }}
            >
              <Text style={styles.login_btn_text}>เข้าสู่ระบบ</Text>
            </Pressable>
            <View style={styles.or_container}>
              <View style={styles.hr}></View>
              <Text style={styles.hr_text}>หรือ</Text>
              <View style={styles.hr}></View>
            </View>
            <Pressable
              style={styles.facebook_btn}
              onPress={() => {
                login_facebook();
              }}
            >
              <Image
                source={require("../../assets/image/auth/facebook.png")}
                resizeMode={"contain"}
                style={styles.social_logo}
              />
              <Text style={styles.social_btn_text}>
                ลงชื่อเข้าใช้ด้วย Facebook
              </Text>
            </Pressable>
            {Platform.OS === "ios" && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                style={styles.apple_btn}
                onPress={async () => {
                  try {
                    const credential = await AppleAuthentication.signInAsync({
                      requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                      ],
                    });

                    // signed in
                    apple(
                      credential.identityToken,
                      credential.fullName.familyName,
                      credential.fullName.givenName
                    );
                  } catch (e) {
                    if (e.code === "ERR_CANCELED") {
                      // handle that the user canceled the sign-in flow
                      console.log(e);
                    } else {
                      // handle other errors
                      console.log(e);
                    }
                  }
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SignInScreen;
