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
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/auth/auth";
import * as ImagePicker from "expo-image-picker";
import { update_user_info } from "../../api/user";

const VerifyBookBankScreen = ({ navigation, route }) => {
  const [bookBankImage, setBookBankImage] = useState(null);
  const [data, setData] = useState({
    isValidBookBank: route.params?.bookBank
      ? route.params.bookBank === "2" || route.params.bookBank === "1"
        ? true
        : false
      : false,
    errorBookBank: "",
  });
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    if (route.params?.bookBank) {
      if (route.params.bookBank === "2" || route.params.bookBank === "1") {
        setBookBankImage(
          route.params?.userID
            ? "https://api.saijo-denki.com/img/club/upload/book_bank/" +
                route.params.userID +
                ".png"
            : null
        );
      }
    }
  }, []);

  const cameraImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled) {
        setBookBankImage(result.uri);
        setModal(false);
        setData({
          ...data,
          isValidBookBank: true,
          errorBookBank: "",
        });
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
        setBookBankImage(result.uri);
        setModal(false);
        setData({
          ...data,
          isValidBookBank: true,
          errorBookBank: "",
        });
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
    if (data.isValidBookBank) {
      try {
        setIsLoading(true);

        let token = await AsyncStorage.getItem("token");
        let book = null;

        if (bookBankImage.split("?").length > 1) {
          book = null;
        } else {
          book = bookBankImage;
        }

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
            null,
            null,
            book
          );

          setIsLoading(false);

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
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      setData({
        ...data,
        errorBookBank: !data.isValidBookBank ? "กรุณาอัพโหลดรูป!" : "",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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
              <Text style={styles.form_label}>เลขที่บัญชี</Text>
              <Pressable
                onPress={() => setModal(true)}
                disabled={
                  route.params?.bookBank
                    ? route.params.bookBank === "2"
                      ? true
                      : false
                    : false
                }
              >
                <ImageBackground
                  source={{
                    uri: route.params?.bookBank
                      ? route.params.bookBank === "2"
                        ? bookBankImage + "?" + new Date()
                        : bookBankImage
                      : bookBankImage,
                  }}
                  style={styles.image_input_container}
                  resizeMode="cover"
                >
                  <Text
                    style={[
                      styles.form_label,
                      styles.empty_image,
                      { display: bookBankImage ? "none" : "flex" },
                    ]}
                  >
                    {bookBankImage ? null : "อัพโหลดรูป"}
                  </Text>
                </ImageBackground>
              </Pressable>

              {data.isValidBookBank ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text
                    style={[
                      styles.error_msg,
                      {
                        color: "#b31117",
                        height: data.errorBookBank.length ? null : 0,
                      },
                    ]}
                  >
                    {data.errorBookBank}
                  </Text>
                </Animatable.View>
              )}
            </View>
            <View
              style={[
                styles.confirm_btn_container,
                {
                  display: route.params?.bookBank
                    ? route.params.bookBank === "2"
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
      <Modal animationType="fade" transparent={true} visible={modal}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <Text style={styles.modal_header}>
              ถ่ายภาพหรือเลือกจากอัลบั้มรูป
            </Text>
            <Pressable style={styles.modal_body} onPress={() => cameraImage()}>
              <Text style={styles.add_title}>กล้อง</Text>
            </Pressable>
            <Pressable style={styles.modal_body} onPress={() => pickImage()}>
              <Text style={styles.add_title}>อัลบั้มรูป</Text>
            </Pressable>
            <Pressable
              style={styles.modal_body}
              onPress={() => {
                setModal(false);
              }}
            >
              <Text style={styles.add_title}>ยกเลิก</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={"#999999"} />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VerifyBookBankScreen;
