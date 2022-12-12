import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  ScrollView,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/home/profile";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { normalize } from "../../components/font";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { user_info, update_user_info, delete_account } from "../../api/user";
import { logout_app } from "../../api/auth";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../components/context";
import { useIsFocused } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [modalMenu, setModalMenu] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("-");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("-");
  const [address, setAddress] = useState("-");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [userID, setUserID] = useState(0);
  const [verifyCode, setVerifyCode] = useState("");
  const [frontID, setFrontID] = useState("0");
  const [backID, setBackID] = useState("0");
  const [accountBook, setAccountBook] = useState("0");

  const mapRef = useRef(MapView);

  const { logout } = useContext(AuthContext);

  const isFocused = useIsFocused();

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
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let res = await user_info(token);
          let decode = jwt_decode(token);

          setUserID(decode.id);
          setName(res.data.data[0].name);
          setLastName(res.data.data[0].lastname);
          setImage(
            "https://api.saijo-denki.com/img/club/upload/profile_img/" +
              res.data.data[0].profile_img +
              "?" +
              new Date()
          );
          setPhoneNumber(res.data.data[0].telephone);
          setAddress(res.data.data[0].address);
          setDistrict(res.data.data[0].district);
          setProvince(res.data.data[0].province);
          setPostalCode(res.data.data[0].postal_code);
          setLatitude(res.data.data[0].latitude);
          setLongitude(res.data.data[0].longitude);
          setVerifyCode(res.data.data[0].saijo_certification);
          setFrontID(res.data.data[0].id_card_front_validate);
          setBackID(res.data.data[0].id_card_back_validate);
          setAccountBook(res.data.data[0].book_bank_validate);
        } catch (error) {
          console.log(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isFocused]);

  const logoutHandle = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      let device_id = await AsyncStorage.getItem("push_notification_token");

      try {
        await logout_app(token, device_id);

        logout();
      } catch (error) {
        console.log(error.response.data.message);

        logout();
      }
    } catch {}
  };

  const cameraImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);

        updateUserInfo(result.uri);
      }
    } catch {
      Alert.alert(
        "Warring!",
        "Please allow Saijo Denki Connect to access camera on your device."
      );
    }

    setModalMenu(false);
  };

  const pickImage = async () => {
    setModalMenu(false);

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);

        updateUserInfo(result.uri);
      }
    } catch {
      Alert.alert(
        "Warring!",
        "Please allow Saijo Denki Connect to access gallery on your device."
      );
    }
  };

  const updateUserInfo = async (uri) => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        await update_user_info(
          token,
          userID,
          name,
          lastName,
          phoneNumber,
          uri,
          address,
          district,
          province,
          postalCode,
          latitude,
          longitude
        );
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const VerifyStatus = (val) => {
    switch (true) {
      case val === "1":
        return "อยู่ระหว่างการตรวจสอบ";
      case val === "2":
        return "อนุมัติ";
      case val === "3":
        return "ไม่อนุมัติ";
      default:
        return "กรุณาอัพโหลดเอกสาร";
    }
  };

  const deleteAccount = () => {
    Alert.alert("คำเตือน", "คุณต้องการลบบัญชีนี้หรือไม่?", [
      {
        text: "ยกเลิก",
        style: "cancel",
      },
      { text: "ตกลง", onPress: () => deleteAccountHandle() },
    ]);
  };

  const deleteAccountHandle = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      await delete_account(token);

      logoutHandle();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={{ width: "90%", maxWidth: 600, alignItems: "center" }}>
        <ScrollView
          style={{
            width: "100%",
            marginBottom: "2.5%",
          }}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.profile_card}>
            <Pressable
              style={styles.profile_image_container}
              onPress={() => setModalMenu(true)}
            >
              <View>
                <Image
                  source={{ uri: image }}
                  resizeMode={"cover"}
                  style={styles.profile_image}
                />
                <View style={styles.edit_icon}>
                  <MaterialCommunityIcons
                    name="pencil"
                    color="#ffffff"
                    size={normalize(12) > 16 ? 16 : normalize(12)}
                  />
                </View>
              </View>
            </Pressable>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.profile_name}>
                {name} {lastName} ({userID})
              </Text>
            </View>
            <Pressable
              style={{ alignItems: "center" }}
              onPress={() =>
                navigation.navigate({
                  name: "ProfileName",
                  params: {
                    userID: userID,
                    name: name,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    image: null,
                    address: address,
                    district: district,
                    province: province,
                    postalCode: postalCode,
                    latitude: latitude,
                    longitude: longitude,
                  },
                })
              }
            >
              <Text style={styles.edit}>แก้ไข</Text>
            </Pressable>
          </View>
          <View style={styles.profile_card}>
            <View style={styles.card_top}>
              <View style={styles.card_left}>
                <FontAwesome5
                  name="mobile-alt"
                  color={"#b31117"}
                  size={normalize(16) > 20 ? 20 : normalize(16)}
                />
              </View>
              <View style={styles.card_center}>
                <Text style={styles.card_label}>เบอร์โทร</Text>
              </View>
              <Pressable
                style={styles.card_right}
                onPress={() =>
                  navigation.navigate({
                    name: "ProfilePhoneNumber",
                    params: {
                      userID: userID,
                      name: name,
                      lastName: lastName,
                      phoneNumber: phoneNumber,
                      image: null,
                      address: address,
                      district: district,
                      province: province,
                      postalCode: postalCode,
                      latitude: latitude,
                      longitude: longitude,
                    },
                  })
                }
              >
                <Text style={styles.edit_text}>แก้ไข</Text>
              </Pressable>
            </View>
            <View style={styles.card_bottom}>
              <View style={styles.card_left}></View>
              <View style={styles.card_center}>
                <Text style={styles.card_phone}>{phoneNumber}</Text>
              </View>
              <View style={styles.card_right}></View>
            </View>
          </View>
          <View style={styles.profile_card}>
            <View style={styles.card_top}>
              <View style={styles.card_left}>
                <FontAwesome5
                  name="building"
                  color={"#b31117"}
                  size={normalize(16) > 20 ? 20 : normalize(16)}
                />
              </View>
              <View style={styles.card_center}>
                <Text style={styles.card_label}>ที่อยู่</Text>
              </View>
              <Pressable
                style={styles.card_right}
                onPress={() =>
                  navigation.navigate({
                    name: "ProfileAddress",
                    params: {
                      userID: userID,
                      name: name,
                      lastName: lastName,
                      phoneNumber: phoneNumber,
                      image: image,
                      address: address,
                      district: district,
                      province: province,
                      postalCode: postalCode,
                      latitude: latitude,
                      longitude: longitude,
                    },
                  })
                }
              >
                <Text style={styles.edit_text}>แก้ไข</Text>
              </Pressable>
            </View>
            <View style={styles.card_bottom}>
              <View style={styles.card_left}></View>
              <View style={styles.card_center}>
                <Text style={styles.card_address}>
                  {address} {district} {province} {postalCode}
                </Text>
              </View>
              <View style={styles.card_right}></View>
            </View>
          </View>
          <View style={styles.profile_card}>
            <View style={styles.card_top}>
              <View style={styles.card_left}>
                <FontAwesome5
                  name="map-marker-alt"
                  color={"#b31117"}
                  size={normalize(16) > 20 ? 20 : normalize(16)}
                />
              </View>
              <View style={styles.card_center}>
                <Text style={styles.card_label}>ตำแหน่ง</Text>
              </View>
              <Pressable
                style={styles.card_right}
                onPress={() =>
                  navigation.navigate({
                    name: "ProfileLocation",
                    params: {
                      userID: userID,
                      name: name,
                      lastName: lastName,
                      phoneNumber: phoneNumber,
                      image: image,
                      address: address,
                      district: district,
                      province: province,
                      postalCode: postalCode,
                      latitude: latitude,
                      longitude: longitude,
                    },
                  })
                }
              >
                <Text style={styles.edit_text}>แก้ไข</Text>
              </Pressable>
            </View>
            <View style={styles.card_bottom}>
              <View style={styles.card_left}></View>
              <View style={[styles.card_center, { flex: 11, marginTop: "2%" }]}>
                <MapView
                  ref={mapRef}
                  style={styles.card_map}
                  region={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    latitudeDelta: 0.0922 / 3,
                    longitudeDelta: 0.0421 / 3,
                  }}
                  scrollEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(latitude),
                      longitude: parseFloat(longitude),
                      latitudeDelta: 0.0922 / 3,
                      longitudeDelta: 0.0421 / 3,
                    }}
                  ></Marker>
                </MapView>
              </View>
            </View>
          </View>
          <View style={styles.profile_card}>
            <View style={styles.card_top}>
              <View style={styles.card_left}>
                <FontAwesome5
                  name="user-check"
                  color={"#b31117"}
                  size={normalize(16) > 20 ? 20 : normalize(16)}
                />
              </View>
              <View style={styles.card_center}>
                <Text style={styles.card_label}>Saijo Denki Verify</Text>
              </View>
              <Pressable
                style={styles.card_right}
                onPress={() => navigation.navigate({ name: "SaijoVerify" })}
              >
                <Text style={styles.edit_text}>ดูข้อมูล</Text>
              </Pressable>
            </View>
            <View style={styles.card_bottom}>
              <View style={styles.card_left}></View>
              <View style={styles.card_center}>
                <Text style={styles.card_phone}>{verifyCode}</Text>
              </View>
              <View style={styles.card_right}></View>
            </View>
          </View>
          <View style={styles.profile_card}>
            <View style={styles.card_top}>
              <View style={styles.card_left}>
                <FontAwesome5
                  name="id-card"
                  color={"#b31117"}
                  size={normalize(16) > 20 ? 20 : normalize(16)}
                />
              </View>
              <View style={styles.card_center}>
                <Text style={styles.card_label}>บัตรประชาชน</Text>
              </View>
              <Pressable
                style={styles.card_right}
                onPress={() =>
                  navigation.navigate({
                    name: "VerifyID",
                    params: {
                      userID: userID,
                      name: name,
                      lastName: lastName,
                      phoneNumber: phoneNumber,
                      image: image,
                      address: address,
                      district: district,
                      province: province,
                      postalCode: postalCode,
                      latitude: latitude,
                      longitude: longitude,
                      frontID: frontID,
                      backID: backID,
                    },
                  })
                }
              >
                <Text style={styles.edit_text}>
                  {frontID === "2" && backID === "2" ? "ดูข้อมูล" : "แก้ไข"}
                </Text>
              </Pressable>
            </View>
            <View style={styles.card_bottom}>
              <View style={styles.card_left}></View>
              <View style={styles.card_center}>
                <Text style={styles.card_phone}>
                  ด้านหน้า: {VerifyStatus(frontID)}, ด้านหลัง:{" "}
                  {VerifyStatus(backID)}
                </Text>
              </View>
              <View style={styles.card_right}></View>
            </View>
          </View>
          <View style={styles.profile_card}>
            <View style={styles.card_top}>
              <View style={styles.card_left}>
                <FontAwesome5
                  name="money-check-alt"
                  color={"#b31117"}
                  size={normalize(16) > 20 ? 20 : normalize(16)}
                />
              </View>
              <View style={styles.card_center}>
                <Text style={styles.card_label}>เลขที่บัญชี</Text>
              </View>
              <Pressable
                style={styles.card_right}
                onPress={() =>
                  navigation.navigate({
                    name: "VerifyBookBank",
                    params: {
                      userID: userID,
                      name: name,
                      lastName: lastName,
                      phoneNumber: phoneNumber,
                      image: image,
                      address: address,
                      district: district,
                      province: province,
                      postalCode: postalCode,
                      latitude: latitude,
                      longitude: longitude,
                      frontID: null,
                      backID: null,
                      bookBank: accountBook,
                    },
                  })
                }
              >
                <Text style={styles.edit_text}>
                  {accountBook === "2" ? "ดูข้อมูล" : "แก้ไข"}
                </Text>
              </Pressable>
            </View>
            <View style={styles.card_bottom}>
              <View style={styles.card_left}></View>
              <View style={styles.card_center}>
                <Text style={styles.card_phone}>
                  {VerifyStatus(accountBook)}
                </Text>
              </View>
              <View style={styles.card_right}></View>
            </View>
          </View>
          <Pressable
            style={styles.change_password}
            onPress={() =>
              navigation.navigate({
                name: "ChangePasswordScreen",
              })
            }
          >
            <Text style={styles.change_password_text}>เปลี่ยนรหัสผ่าน</Text>
          </Pressable>
          <Pressable
            style={styles.delete_account}
            onPress={() => deleteAccount()}
          >
            <Text style={styles.delete_account_text}>ลบบัญชี</Text>
          </Pressable>
          <Pressable style={styles.sign_out} onPress={() => logoutHandle()}>
            <Text style={styles.sign_out_text}>ออกจากระบบ</Text>
          </Pressable>
        </ScrollView>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalMenu}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <Text style={styles.modal_header}>เปลี่ยนรูปโปรไฟล์ของคุณ</Text>
            <Pressable style={styles.modal_body} onPress={cameraImage}>
              <Text style={styles.add_title}>กล้อง</Text>
            </Pressable>
            <Pressable style={styles.modal_body} onPress={pickImage}>
              <Text style={styles.add_title}>อัลบั้มรูป</Text>
            </Pressable>
            <Pressable
              style={styles.modal_body}
              onPress={() => {
                setModalMenu(false);
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

export default ProfileScreen;
