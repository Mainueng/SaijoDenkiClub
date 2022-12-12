import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/header";
import { validateEmail } from "../../components/validate";
import styles from "../../assets/stylesheet/auth/auth";
import * as Animatable from "react-native-animatable";
import { forgot_password } from "../../api/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const [data, setData] = useState({
    email: "",
    isValidEmail: false,
    errorEmail: "",
  });

  const emailHandle = (val) => {
    if (val.trim().length) {
      let validate = validateEmail(val);

      if (validate) {
        setData({
          ...data,
          email: val,
          isValidEmail: true,
          errorEmail: "",
        });
      } else {
        setData({
          ...data,
          email: val,
          isValidEmail: false,
          errorEmail: "รูปแบบไม่ถูกต้อง",
        });
      }
    } else {
      setData({
        ...data,
        email: val,
        isValidEmail: false,
        errorEmail: "กรุณาระบุอีเมล์!",
      });
    }
  };

  const submitHandle = async () => {
    if (data.isValidEmail) {
      try {
        await forgot_password(data.email);

        Alert.alert("สำเร็จ!", "รหัสผ่านใหม่จะถูกส่งไปที่อีเมล์.", [
          {
            text: "Close",
            onPress: () => navigation.navigate("Sign In"),
          },
        ]);
      } catch (error) {
        console.log(error);
        Alert.alert("ผิดพลาด!", error.response.data.message);
      }
    } else {
      setData({
        ...data,
        errorEmail: data.errorEmail.length
          ? data.errorEmail
          : "กรุณาระบุอีเมล์!",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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
                <Text style={styles.form_label}>อีเมล์</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="อีเมล์"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  keyboardType={"email-address"}
                  onChangeText={(val) => emailHandle(val)}
                />
                {data.isValidEmail ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorEmail.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorEmail}
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

export default ForgotPasswordScreen;
