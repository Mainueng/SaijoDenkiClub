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
import { validatePhoneNumber } from "../../components/validate";

const ProfilePhoneNumberScreen = ({ navigation, route }) => {
  const [data, setData] = useState({
    phone_number: route.params?.phoneNumber ? route.params.phoneNumber : "",
    isValidPhoneNumber: true,
    errorPhoneNumber: "",
  });

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

  const submitHandle = async () => {
    if (data.isValidPhoneNumber) {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          await update_user_info(
            token,
            route.params?.userID ? route.params.userID : "",
            route.params?.name ? route.params.name : "",
            route.params?.lastName ? route.params.lastName : "",
            data.phone_number,
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
        errorPhoneNumber:
          data.errorPhoneNumber === ""
            ? "กรุณาระบุเบอร์โทร!"
            : data.errorPhoneNumber,
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
                <Text style={styles.form_label}>เบอร์โทร</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="เบอร์โทร"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  keyboardType={"phone-pad"}
                  onChangeText={(val) => phoneNumberHandle(val)}
                  defaultValue={data.phone_number}
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

export default ProfilePhoneNumberScreen;
