import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  ImageBackground,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/auth/auth";
import * as ImagePicker from "expo-image-picker";
import { update_user_info } from "../../api/user";

const VerifyIdScreen = ({ navigation, route }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [data, setData] = useState({
    isValidFront: route.params?.frontID
      ? route.params.frontID === "2"
        ? true
        : false
      : false,
    isValidBack: route.params?.backID
      ? route.params.backID === "2"
        ? true
        : false
      : false,
    errorFront: "",
    errorBack: "",
  });
  const [modalFront, setModalFront] = useState(false);
  const [modalBack, setModalBack] = useState(false);

  useEffect(() => {
    (async () => {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (camera.status !== "granted") {
        Alert.alert(
          "Warring!",
          "Please allow Saijo Denki Club to access camera on your device."
        );
      }

      if (gallery.status !== "granted") {
        Alert.alert(
          "Warring!",
          "Please allow Saijo Denki Club to access gallery on your device."
        );
      }
    })();

    if (route.params?.frontID) {
      if (route.params.frontID === "2") {
        setFrontImage(
          route.params?.userID
            ? "https://api.saijo-denki.com/img/club/upload/id_card_front/" +
                route.params.userID +
                ".png"
            : null
        );
      }
    }

    if (route.params?.backID) {
      if (route.params.backID === "2") {
        setBackImage(
          route.params?.backID
            ? "https://api.saijo-denki.com/img/club/upload/id_card_back/" +
                route.params.userID +
                ".png"
            : null
        );
      }
    }
  }, []);

  const cameraImage = async (type) => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled) {
        if (type === "front") {
          setFrontImage(result.uri);
          setModalFront(false);
          setData({
            ...data,
            isValidFront: true,
            errorFront: "",
          });
        } else {
          setBackImage(result.uri);
          setModalBack(false);
          setData({
            ...data,
            isValidBack: true,
            errorBack,
          });
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Warring!",
        "Please allow Saijo Denki Connect to access camera on your device."
      );
    }
  };

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled) {
        if (type === "front") {
          setFrontImage(result.uri);
          setModalFront(false);
          setData({
            ...data,
            isValidFront: true,
            errorFront: "",
          });
        } else {
          setBackImage(result.uri);
          setModalBack(false);
          setData({
            ...data,
            isValidBack: true,
            errorBack: "",
          });
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Warring!",
        "Please allow Saijo Denki Connect to access gallery on your device."
      );
    }
  };

  const submitHandle = async () => {
    if (data.isValidFront && data.isValidBack) {
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
            route.params?.address ? route.params.address : "",
            route.params?.district ? route.params.district : "",
            route.params?.province ? route.params.province : "",
            route.params?.postalCode ? route.params.postalCode : "",
            route.params?.latitude ? route.params.latitude : "",
            route.params?.longitude ? route.params.longitude : "",
            frontImage,
            backImage
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
        errorFront: !data.isValidFront ? "กรุณาอัพโหลดรูป!" : "",
        errorBack: !data.isValidBack ? "กรุณาอัพโหลดรูป!" : "",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
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
              <Text style={styles.form_label}>รูปด้านหน้า</Text>
              <Pressable
                onPress={() => setModalFront(true)}
                disabled={
                  route.params?.frontID
                    ? route.params.frontID === "2"
                      ? true
                      : false
                    : false
                }
              >
                <ImageBackground
                  source={{
                    uri: route.params?.frontImage
                      ? route.params.frontImage === "2"
                        ? frontImage + "?" + new Date()
                        : frontImage
                      : frontImage,
                  }}
                  style={styles.image_input_container}
                  resizeMode="cover"
                >
                  <Text
                    style={[
                      styles.form_label,
                      styles.empty_image,
                      { display: frontImage ? "none" : "flex" },
                    ]}
                  >
                    {frontImage ? null : "อัพโหลดรูป"}
                  </Text>
                </ImageBackground>
              </Pressable>

              {data.isValidFront ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text
                    style={[
                      styles.error_msg,
                      {
                        color: "#b31117",
                        height: data.errorFront.length ? null : 0,
                      },
                    ]}
                  >
                    {data.errorFront}
                  </Text>
                </Animatable.View>
              )}
            </View>
            <View style={styles.form_group}>
              <Text style={styles.form_label}>รูปด้านหลัง</Text>
              <Pressable
                onPress={() => setModalBack(true)}
                disabled={
                  route.params?.backID
                    ? route.params.backID === "2"
                      ? true
                      : false
                    : false
                }
              >
                <ImageBackground
                  source={{
                    uri: route.params?.backImage
                      ? route.params.backImage === "2"
                        ? backImage + "?" + new Date()
                        : backImage
                      : backImage,
                  }}
                  style={styles.image_input_container}
                  resizeMode="cover"
                >
                  <Text
                    style={[
                      styles.form_label,
                      styles.empty_image,
                      { display: backImage ? "none" : "flex" },
                    ]}
                  >
                    {backImage ? null : "อัพโหลดรูป"}
                  </Text>
                </ImageBackground>
              </Pressable>

              {data.isValidBack ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text
                    style={[
                      styles.error_msg,
                      {
                        color: "#b31117",
                        height: data.errorBack.length ? null : 0,
                      },
                    ]}
                  >
                    {data.errorBack}
                  </Text>
                </Animatable.View>
              )}
            </View>
            <View
              style={[
                styles.confirm_btn_container,
                {
                  display: route.params?.backID
                    ? route.params.frontID === "2"
                      ? "none"
                      : "flex"
                    : "flex" && route.params?.backID
                    ? route.params.backID === "2"
                      ? "none"
                      : "flex"
                    : "flex",
                },
              ]}
            >
              <Pressable
                style={styles.confirm_btn}
                onPress={() => {
                  submitHandle();
                }}
              >
                <Text style={styles.confirm_text}>ยืนยัน</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal animationType="fade" transparent={true} visible={modalFront}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <Text style={styles.modal_header}>
              ถ่ายภาพหรือเลือกจากอัลบั้มรูป
            </Text>
            <Pressable
              style={styles.modal_body}
              onPress={() => cameraImage("front")}
            >
              <Text style={styles.add_title}>กล้อง</Text>
            </Pressable>
            <Pressable
              style={styles.modal_body}
              onPress={() => pickImage("front")}
            >
              <Text style={styles.add_title}>อัลบั้มรูป</Text>
            </Pressable>
            <Pressable
              style={styles.modal_body}
              onPress={() => {
                setModalFront(false);
              }}
            >
              <Text style={styles.add_title}>ยกเลิก</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalBack}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <Text style={styles.modal_header}>
              ถ่ายภาพหรือเลือกจากอัลบั้มรูป
            </Text>
            <Pressable
              style={styles.modal_body}
              onPress={() => cameraImage("back")}
            >
              <Text style={styles.add_title}>กล้อง</Text>
            </Pressable>
            <Pressable
              style={styles.modal_body}
              onPress={() => pickImage("back")}
            >
              <Text style={styles.add_title}>อัลบั้มรูป</Text>
            </Pressable>
            <Pressable
              style={styles.modal_body}
              onPress={() => {
                setModalBack(false);
              }}
            >
              <Text style={styles.add_title}>ยกเลิก</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VerifyIdScreen;