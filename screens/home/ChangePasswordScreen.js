import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/auth/auth";
import { change_password } from "../../api/user";

const ChangePasswordScreen = ({ navigation, route }) => {
  const [data, setData] = useState({
    password: "",
    confirm_password: "",
    isValidPassword: false,
    isValidConfirmPassword: false,
    errorPassword: "",
    errorConfirmPassword: "",
  });

  const passwordHandle = (val) => {
    if (val.trim().length > 4 && val.trim().length < 12) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
        errorPassword: "",
      });
    } else if (val.trim().length < 5 || val.trim().length > 13) {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
        errorPassword: "รหัสผ่านต้องมีความยาว 5 - 12 ตัวอักษร!",
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
        errorPassword: "กรุณาระบุรหัสผ่าน!",
      });
    }
  };

  const confirmPasswordHandle = (val) => {
    if (val.length === 0) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: false,
        errorConfirmPassword: "กรุณาระบุรหัสผ่าน!",
      });
    } else if (data.password !== val) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: false,
        errorConfirmPassword: "รหัสผ่านไม่ตรง!",
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: true,
        errorConfirmPassword: "",
      });
    }
  };

  const submitHandle = async () => {
    if (data.isValidPassword && data.isValidConfirmPassword) {
      try {
        let token = await AsyncStorage.getItem("token");
        await change_password(token, data.password);

        Alert.alert("สำเร็จ", "เปลี่ยนรหัสผ่านสำเร็จ", [
          { text: "ตกลง", onPress: () => navigation.goBack() },
        ]);
      } catch (error) {
        Alert.alert("ล้มเหลว", "เปลี่ยนรหัสผ่านไม่สำเร็จ โปรดดำเนินการใหม่");
        console.log(error);
      }
    } else {
      setData({
        ...data,
        errorPassword:
          data.errorPassword === "" ? "กรุณาระบุรหัสผ่าน!" : data.errorPassword,
        errorConfirmPassword:
          data.errorConfirmPassword === ""
            ? "กรุณาระบุรหัสผ่าน!"
            : data.errorConfirmPassword,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          style={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.sub_container}>
            <View style={styles.form_container}>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>รหัสผ่าน</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="รหัสผ่าน"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(val) => passwordHandle(val)}
                />
                {data.isValidPassword ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorPassword.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorPassword}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>ยืนยันรหัสผ่าน</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="ยืนยันรหัสผ่าน"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(val) => confirmPasswordHandle(val)}
                />
                {data.isValidConfirmPassword ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorConfirmPassword.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorConfirmPassword}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.confirm_btn_container}>
                <Pressable
                  style={styles.confirm_btn}
                  onPress={() => {
                    Keyboard.dismiss();
                    submitHandle();
                  }}
                >
                  <Text style={styles.confirm_text}>ยืนยัน</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
