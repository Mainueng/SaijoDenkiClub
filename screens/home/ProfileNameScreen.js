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
import { update_user_info } from "../../api/user";

const ProfileNameScreen = ({ navigation, route }) => {
  const [data, setData] = useState({
    first_name: route.params?.name ? route.params.name : "",
    last_name: route.params?.lastName ? route.params.lastName : "",
    isValidFirstName: true,
    isValidLastName: true,
    errorFirstName: "",
    errorLastName: "",
  });

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

  const submitHandle = async () => {
    if (data.isValidFirstName && data.isValidLastName) {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          await update_user_info(
            token,
            route.params?.userID ? route.params.userID : "",
            data.first_name,
            data.last_name,
            route.params?.phoneNumber ? route.params.phoneNumber : "",
            null,
            route.params?.address ? route.params.address : "",
            route.params?.district ? route.params.district : "",
            route.params?.province ? route.params.province : "",
            route.params?.postalCode ? route.params.postalCode : "",
            route.params?.latitude ? route.params.latitude : "",
            route.params?.longitude ? route.params.longitude : ""
          );

          Alert.alert("บันทึกข้อมูลสำเร็จ", "", [
            {
              text: "ตกลง",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        } catch (error) {
          Alert.alert(error.response.data.message);
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
                <Text style={styles.form_label}>ชื่อ</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="ชื่อ"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => firstNameHandel(val)}
                  defaultValue={data.first_name}
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
                  onChangeText={(val) => lastNameHandel(val)}
                  defaultValue={data.last_name}
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

export default ProfileNameScreen;
