import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Modal,
  ImageBackground,
  Pressable,
  Dimensions,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "../../assets/stylesheet/warranty/warranty";
import { BarCodeScanner } from "expo-barcode-scanner";
import QR_Background from "../../assets/image/warranty/qr_background.png";
import QR_Background_Ipad from "../../assets/image/warranty/qr_background_ipad.png";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { warranty_validate } from "../../api/warranty";
import { useIsFocused } from "@react-navigation/native";

const WarrantyScreen = ({ navigation }) => {
  const [scanned, setScanned] = useState(true);
  const [indoor, setIndoor] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [indoorValue, setIndoorValue] = useState("");
  const [outdoorValue, setOutdoorValue] = useState("");
  const [type, setType] = useState(1);
  const [modalIndoor, setModalIndoor] = useState(false);
  const [modalOutdoor, setModalOutdoor] = useState(false);
  const [modalInput, setModalInput] = useState(false);
  const [isValidIndoor, setIsValidIndoor] = useState(true);
  const [isValidOutdoor, setIsValidOutdoor] = useState(true);

  const { width, height } = Dimensions.get("window");

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Warring!",
          "Please allow Saijo Denki Club to access camera on your device."
        );
      }
    })();
  }, []);

  const handleScan = ({ data }) => {
    setScanned(false);

    if (!indoorValue.length) {
      setIndoorValue(data);
    } else if (!outdoorValue.length) {
      setOutdoorValue(data);
    }

    if (!indoor) {
      setModalIndoor(true);
    } else if (!outdoor) {
      setModalOutdoor(true);
    }
  };

  const handleConfirm = async (type) => {
    setScanned(true);

    if (type === "indoor") {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let res = await warranty_validate(token, indoorValue);
          setIndoor(true);

          if (res.data.code === 202) {
            navigation.navigate("WarrantyInfo", {
              indoor: res.data.data[0].indoor_serial,
              outdoor: res.data.data[0].outdoor_serial,
            });
          } else {
            if (res.data.data[0].type === "Air Purifier") {
              navigation.navigate("WarrantyInfo", {
                indoor: indoorValue,
                outdoor: indoorValue,
              });
            }
          }
        } catch (error) {
          setIndoorValue("");
          Alert.alert(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let token = await AsyncStorage.getItem("token");
        try {
          await warranty_validate(token, outdoorValue);

          if (indoorValue.length !== 0 && outdoorValue.length !== 0) {
            setModalInput(false);
            setOutdoor(true);
            navigation.navigate("WarrantyInfo", {
              indoor: indoorValue,
              outdoor: outdoorValue,
            });
          }
        } catch (error) {
          setOutdoorValue("");
          Alert.alert(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancel = (type) => {
    if (type === "indoor") {
      setIndoorValue("");
    } else {
      setOutdoorValue("");
    }

    setScanned(true);
  };

  const indoorChange = (val) => {
    if (val.trim().length) {
      setIndoorValue(val);
      setIsValidIndoor(true);
    } else {
      setIndoorValue(val);
      setIsValidIndoor(false);
    }
  };

  const outdoorChange = (val) => {
    if (val.trim().length) {
      setOutdoorValue(val);
      setIsValidOutdoor(true);
    } else {
      setOutdoorValue("");
      setIsValidOutdoor(false);
    }
  };

  const handleConfirmInput = () => {
    if (indoorValue.length && outdoorValue.length) {
      setModalInput(false);
      navigation.navigate("WarrantyInfoScreen", {
        indoor: indoorValue,
        outdoor: outdoorValue,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {isFocused && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? handleScan : undefined}
          style={[
            StyleSheet.absoluteFill,
            {
              height: "110%",
            },
          ]}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        >
          <View
            style={{
              height: "100%",
              width: width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={height > 900 ? QR_Background : QR_Background_Ipad}
              style={styles.scan_bg}
            >
              <View style={styles.type_container}>
                <Pressable
                  style={[
                    styles.scan_container,
                    { backgroundColor: type === 1 ? "#b31117" : "#ffffff" },
                  ]}
                  onPress={() => setType(1)}
                >
                  <Text
                    style={[
                      styles.scan_text,
                      { color: type === 1 ? "#ffffff" : "#b31117" },
                    ]}
                  >
                    Scan QR Code
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.input_container,
                    { backgroundColor: type === 2 ? "#b31117" : "#ffffff" },
                  ]}
                  onPress={() => {
                    setType(2);
                    setScanned(false);
                    setIndoorValue("");
                    setOutdoorValue("");
                    setModalInput(true);
                    setIndoor(false);
                  }}
                >
                  <Text
                    style={[
                      styles.scan_text,
                      { color: type === 2 ? "#ffffff" : "#b31117" },
                    ]}
                  >
                    Serial Number
                  </Text>
                </Pressable>
              </View>
              <View style={styles.sn_container}>
                <View style={styles.indoor_container}>
                  <Text
                    style={[styles.sn_status, { opacity: indoor ? 1 : 0.35 }]}
                  >
                    Indoor
                  </Text>
                  <Pressable
                    style={{
                      display: indoor ? "flex" : "none",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setIndoor(false);
                      setIndoorValue("");
                    }}
                  >
                    <Text style={styles.sn_value}>
                      {indoorValue}{" "}
                      <FontAwesome5
                        name="trash-alt"
                        color={"#ffffff"}
                        size={width * 0.035}
                      />
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.indoor_container}>
                  <Text
                    style={[styles.sn_status, { opacity: outdoor ? 1 : 0.35 }]}
                  >
                    Outdoor
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        </BarCodeScanner>
      )}

      <Modal animationType="fade" transparent={true} visible={modalIndoor}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <Text style={styles.modal_header}>ผลการแสกน</Text>
            <Text style={styles.serial_text}>
              หมายเลขเครื่อง {indoorValue.length ? indoorValue : null}
            </Text>
            <View style={styles.btn_modal_container}>
              <Pressable
                style={[
                  styles.btn_modal,
                  { borderRightWidth: 1, borderRightColor: "#b31117" },
                ]}
                onPress={() => {
                  setModalIndoor(false);
                  handleCancel("indoor");
                }}
              >
                <Text
                  style={[
                    styles.btn_text,
                    {
                      color: "#b31117",
                    },
                  ]}
                >
                  ยกเลิก
                </Text>
              </Pressable>
              <Pressable
                style={[styles.btn_modal, { backgroundColor: "#b31117" }]}
                onPress={() => {
                  setModalIndoor(false);
                  handleConfirm("indoor");
                }}
              >
                <Text
                  style={[
                    styles.btn_text,
                    {
                      color: "#ffffff",
                    },
                  ]}
                >
                  ยืนยัน
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalOutdoor}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <Text style={styles.modal_header}>ผลการแสกน</Text>
            <Text style={styles.serial_text}>
              หมายเลขเครื่อง {outdoorValue.length ? outdoorValue : null}
            </Text>
            <View style={styles.btn_modal_container}>
              <Pressable
                style={[
                  styles.btn_modal,
                  { borderRightWidth: 1, borderRightColor: "#b31117" },
                ]}
                onPress={() => {
                  setModalOutdoor(false);
                  handleCancel("outdoor");
                }}
              >
                <Text
                  style={[
                    styles.btn_text,
                    {
                      color: "#b31117",
                    },
                  ]}
                >
                  ยกเลิก
                </Text>
              </Pressable>
              <Pressable
                style={[styles.btn_modal, { backgroundColor: "#b31117" }]}
                onPress={() => {
                  setModalOutdoor(false);
                  handleConfirm("outdoor");
                }}
              >
                <Text
                  style={[
                    styles.btn_text,
                    {
                      color: "#ffffff",
                    },
                  ]}
                >
                  ยืนยัน
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalInput}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <View style={styles.modal_header_container}>
              <Text style={[styles.modal_header, { color: "#ffffff" }]}>
                หมายเลขเครื่อง
              </Text>
            </View>
            <View style={styles.form_group}>
              <Text style={styles.form_label}>Indoor</Text>
              <TextInput
                style={styles.from_input}
                placeholder={"Indoor"}
                placeholderTextColor="rgba(0,0,0,0.5)"
                autoCapitalize="none"
                onChangeText={(val) => indoorChange(val)}
              />
              {isValidIndoor ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>กรุณาระบุหมายเลข Indoor</Text>
                </Animatable.View>
              )}
              <Text style={styles.form_label}>Outdoor</Text>
              <TextInput
                style={styles.from_input}
                placeholder={"Outdoor"}
                placeholderTextColor="rgba(0,0,0,0.5)"
                autoCapitalize="none"
                onChangeText={(val) => outdoorChange(val)}
              />
              {isValidOutdoor ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>กรุณาระบุหมายเลข Outdoor</Text>
                </Animatable.View>
              )}
            </View>
            <View style={styles.btn_modal_container}>
              <Pressable
                style={[
                  styles.btn_modal,
                  { borderRightWidth: 1, borderRightColor: "#b31117" },
                ]}
                onPress={() => {
                  setModalInput(false);
                  setIndoorValue("");
                  setOutdoorValue("");
                  setScanned(true);
                  setType(1);
                }}
              >
                <Text
                  style={[
                    styles.btn_text,
                    {
                      color: "#b31117",
                    },
                  ]}
                >
                  ยกเลิก
                </Text>
              </Pressable>
              <Pressable
                style={[styles.btn_modal, { backgroundColor: "#b31117" }]}
                onPress={() => {
                  setModalOutdoor(false);
                  handleConfirmInput();
                }}
              >
                <Text
                  style={[
                    styles.btn_text,
                    {
                      color: "#ffffff",
                    },
                  ]}
                >
                  ยืนยัน
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WarrantyScreen;
