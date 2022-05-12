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

const ProfileAddressScreen = ({ navigation, route }) => {
  const [data, setData] = useState({
    address: route.params?.address ? route.params.address : "",
    district: route.params?.district ? route.params.district : "",
    province: route.params?.province ? route.params.province : "",
    postalCode: route.params?.postalCode ? route.params.postalCode : "",
    isValidAddress: true,
    isValidDistrict: true,
    isValidProvince: true,
    isValidPostalCode: true,
    errorAddress: "",
    errorDistrict: "",
    errorProvince: "",
    errorPostalCode: "",
  });

  const AddressChange = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        address: val,
        isValidAddress: true,
      });
    } else {
      setData({
        ...data,
        address: val,
        isValidAddress: false,
      });
    }
  };

  const DistrictChange = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        district: val,
        isValidDistrict: true,
      });
    } else {
      setData({
        ...data,
        district: val,
        isValidDistrict: false,
      });
    }
  };

  const ProvinceChange = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        province: val,
        isValidProvince: true,
      });
    } else {
      setData({
        ...data,
        province: val,
        isValidProvince: false,
      });
    }
  };

  const PostalCodeChange = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        postalCode: val,
        isValidPostalCode: true,
      });
    } else {
      setData({
        ...data,
        postalCode: val,
        isValidPostalCode: false,
      });
    }
  };

  const submitHandle = async () => {
    if (
      data.isValidAddress &&
      data.isValidDistrict &&
      data.isValidProvince &&
      data.isValidPostalCode
    ) {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          await update_user_info(
            token,
            route.params?.userID ? route.params.userID : "",
            route.params?.name ? route.params.name : "",
            route.params?.lastName ? route.params.lastName : "",
            route.params?.phoneNumber ? route.params.phoneNumber : "",
            null,
            data.address,
            data.district,
            data.province,
            data.postalCode,
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
                  style={[styles.from_input, { height: 120 }]}
                  placeholder="ที่อยู่"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => AddressChange(val)}
                  defaultValue={data.address}
                  multiline={true}
                  maxLength={255}
                />
                {data.isValidAddress ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorAddress.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorAddress}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>เขต/อำเภอ</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="เขต/อำเภอ"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => DistrictChange(val)}
                  defaultValue={data.district}
                />
                {data.isValidDistrict ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorDistrict.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorDistrict}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>จังหวัด</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="จังหวัด"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => ProvinceChange(val)}
                  defaultValue={data.province}
                />
                {data.isValidProvince ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorProvince.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorProvince}
                    </Text>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.form_group}>
                <Text style={styles.form_label}>รหัสไปรษณีย์</Text>
                <TextInput
                  style={styles.from_input}
                  placeholder="รหัสไปรษณีย์"
                  placeholderTextColor={"rgba(0,0,0,0.5)"}
                  autoCapitalize="none"
                  onChangeText={(val) => PostalCodeChange(val)}
                  defaultValue={data.postalCode}
                  keyboardType={"number-pad"}
                />
                {data.isValidProvince ? null : (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text
                      style={[
                        styles.error_msg,
                        {
                          color: "#b31117",
                          height: data.errorPostalCode.length ? null : 0,
                        },
                      ]}
                    >
                      {data.errorPostalCode}
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

export default ProfileAddressScreen;
