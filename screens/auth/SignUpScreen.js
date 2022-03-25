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
import Header from "../../components/header";
import { validateEmail, validatePhoneNumber } from "../../components/validate";
import { sign_up } from "../../api/auth";

const SignUpScreen = ({ navigation }) => {
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

  const firstNameHandel = (val) => {
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
        errorFirstName: "First name can't must less then 80 character!",
      });
    } else {
      setData({
        ...data,
        first_name: val,
        isValidFirstName: false,
        errorFirstName: "First name can't be empty!",
      });
    }
  };

  const lastNameHandel = (val) => {
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
        errorLastName: "Last name can't must less then 80 character!",
      });
    } else {
      setData({
        ...data,
        last_name: val,
        isValidLastName: false,
        errorLastName: "Last name can't be empty!",
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
          errorPhoneNumber: "Invalid format",
        });
      }
    } else {
      setData({
        ...data,
        phone_number: val,
        isValidPhoneNumber: false,
        errorPhoneNumber: "Phone number can't be empty!",
      });
    }
  };

  const emailHandel = (val) => {
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
          errorEmail: "Invalid format",
        });
      }
    } else {
      setData({
        ...data,
        email: val,
        isValidEmail: false,
        errorEmail: "Email can't be empty!",
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
        errorPassword: "Password must between from 5 to 12 character!",
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
        errorPassword: "Password can't be empty!",
      });
    }
  };

  const confirmPasswordHandle = (val) => {
    if (val.length === 0) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: false,
        errorConfirmPassword: "Confirm password can't be empty!",
      });
    } else if (data.password !== val) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: false,
        errorConfirmPassword: "Password don't match!",
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
          Alert.alert("Sign-up failed !", error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setData({
        ...data,
        errorFirstName:
          data.errorFirstName === ""
            ? "First name can't be empty!"
            : data.errorFirstName,
        errorLastName:
          data.errorLastName === ""
            ? "Last name can't be empty!"
            : data.errorLastName,
        errorEmail:
          data.errorEmail === "" ? "Email can't be empty!" : data.errorEmail,
        errorPhoneNumber:
          data.errorPhoneNumber === ""
            ? "Phone number can't be empty!"
            : data.errorPhoneNumber,
        errorPassword:
          data.errorPassword === ""
            ? "Password can't be empty!"
            : data.errorPassword,
        errorConfirmPassword:
          data.errorConfirmPassword === ""
            ? "Confirm password can't be empty!"
            : data.errorConfirmPassword,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                <Text style={styles.form_label}>First Name</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="First Name"
                  placeholderTextColor="rgba(143,116,109,0.5)"
                  autoCapitalize="none"
                  onChangeText={(val) => firstNameHandel(val)}
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
                <Text style={styles.form_label}>Last Name</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(143,116,109,0.5)"
                  autoCapitalize="none"
                  onChangeText={(val) => lastNameHandel(val)}
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
                <Text style={styles.form_label}>Email</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="Email"
                  placeholderTextColor="rgba(143,116,109,0.5)"
                  autoCapitalize="none"
                  keyboardType={"email-address"}
                  onChangeText={(val) => emailHandel(val)}
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
                <Text style={styles.form_label}>Phone Number</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(143,116,109,0.5)"
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
                <Text style={styles.form_label}>Password</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="Password"
                  placeholderTextColor="rgba(143,116,109,0.5)"
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
                <Text style={styles.form_label}>Confirm Password</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(143,116,109,0.5)"
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
                  <Text style={styles.confirm_text}>Sign Up</Text>
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
