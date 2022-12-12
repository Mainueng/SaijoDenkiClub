import React, { useContext, useState } from "react";
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
import { AuthContext } from "../../components/context";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/auth/auth";
import { validateEmail, validatePhoneNumber } from "../../components/validate";
import { sign_up } from "../../api/auth";

const SignUpScreen = () => {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    isValidFirstName: false,
    isValidLastName: false,
    isValidEmail: false,
    isValidPhoneNumber: false,
    isValidPassword: false,
    isValidConfirmPassword: false,
    errorFirstName: "",
    errorLastName: "",
    errorEmail: "",
    errorPhoneNumber: "",
    errorPassword: "",
    errorConfirmPassword: "",
  });

  const { login } = useContext(AuthContext);

  const firstNameHandle = (val) => {
    if (val.trim().length) {
      setData({
        ...data,
        first_name: val,
        isValidFirstName: true,
        errorFirstName: "",
      });
    } else if (val.trim().length > 80) {
      setData({
        ...data,
        first_name: val,
        isValidFirstName: false,
        errorFirstName: "ชื่อต้องมีความยาวไม่เกิน 80 ตัวอักษร!",
      });
    } else {
      setData({
        ...data,
        first_name: val,
        isValidFirstName: false,
        errorFirstName: "กรุณาระบุชื่อ!",
      });
    }
  };

  const lastNameHandle = (val) => {
    if (val.trim().length) {
      setData({
        ...data,
        last_name: val,
        isValidLastName: true,
        errorLastName: "",
      });
    } else if (val.trim().length > 80) {
      setData({
        ...data,
        last_name: val,
        isValidLastName: false,
        errorLastName: "นามสกุลต้องมีความยาวไม่เกิน 80 ตัวอักษร!",
      });
    } else {
      setData({
        ...data,
        last_name: val,
        isValidLastName: false,
        errorLastName: "กรุณาระบุนามสกุล!",
      });
    }
  };

  const phoneNumberHandle = (val) => {
    if (val.trim().length) {
      let validate = validatePhoneNumber(val);

      if (validate) {
        setData({
          ...data,
          phone_number: val,
          isValidPhoneNumber: true,
          errorPhoneNumber: "",
        });
      } else {
        setData({
          ...data,
          phone_number: val,
          isValidPhoneNumber: false,
          errorPhoneNumber: "รูปแบบไม่ถูกต้อง",
        });
      }
    } else {
      setData({
        ...data,
        phone_number: val,
        isValidPhoneNumber: false,
        errorPhoneNumber: "กรุณาระบุเบอร์โทร!",
      });
    }
  };

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
    if (
      data.isValidFirstName &&
      data.isValidLastName &&
      data.isValidEmail &&
      data.isValidPhoneNumber &&
      data.isValidPassword &&
      data.isValidConfirmPassword
    ) {
      try {
        let device_id = await AsyncStorage.getItem("push_notification_token");

        try {
          await sign_up(
            data.first_name,
            data.last_name,
            data.email,
            data.phone_number,
            data.password,
            device_id
          );

          login(data.email, data.password);
        } catch (error) {
          Alert.alert("ลงทะเบียนไม่สำเร็จ!", error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setData({
        ...data,
        errorFirstName:
          data.errorFirstName === "" ? "กรุณาระบุชื่อ!" : data.errorFirstName,
        errorLastName:
          data.errorLastName === "" ? "กรุณาระบุนามสกุล!" : data.errorLastName,
        errorEmail:
          data.errorEmail === "" ? "กรุณาระบุอีเมล์!" : data.errorEmail,
        errorPhoneNumber:
          data.errorPhoneNumber === ""
            ? "กรุณาระบุเบอร์โทร!"
            : data.errorPhoneNumber,
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
                <Text style={styles.form_label}>ชื่อ</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="ชื่อ"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => firstNameHandle(val)}
                />
                {data.isValidFirstName ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorFirstName.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorFirstName}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>นามสกุล</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="นามสกุล"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => lastNameHandle(val)}
                />
                {data.isValidLastName ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorLastName.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorLastName}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>อีเมล์</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="Email"
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
              <View style={styles.form_group}>
                <Text style={styles.form_label}>เบอร์โทร</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="เบอร์โทร"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  keyboardType={"phone-pad"}
                  onChangeText={(val) => phoneNumberHandle(val)}
                />
                {data.isValidPhoneNumber ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorPhoneNumber.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorPhoneNumber}
                    </Text>
                  </Animatable.View>
                )}
              </View>
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
                  <Text style={styles.confirm_text}>ลงทะเบียน</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
