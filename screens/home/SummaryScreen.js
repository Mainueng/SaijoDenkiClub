import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  Platform,
  LayoutAnimation,
  UIManager,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from "../../components/font";
import styles from "../../assets/stylesheet/home/report";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import * as ImagePicker from "expo-image-picker";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import {
  summaryForm,
  saveSummaryForm,
  uploadPic,
  uploadInstallPic,
} from "../../api/summary";
import { useIsFocused } from "@react-navigation/native";
// import { checkOut } from "../../api/jobs";

const { width, height } = Dimensions.get("window");

const ExpandableComponent = ({
  data,
  onPressFunction,
  jobType,
  setModalVisible,
  setImageUri,
  setModalTitle,
  updateValue,
  updateTitle,
  summaryValidate,
  jobID,
}) => {
  useEffect(() => {
    data.body.map((item) => {
      item.value.map((data) => {
        if (data.input_type === "textarea") {
          if (data.value) {
            summaryValidate(data.value ? true : false);
          }
        }
      });
    });
  }),
    [];

  const outputFormat = (value, type, unit, index, sn, order) => {
    switch (true) {
      case unit === "touch":
        return (
          <Pressable
            onPress={() =>
              updateValue(
                index,
                value === "false" ? "true" : "false",
                sn,
                unit,
                order
              )
            }
          >
            <Text
              style={[styles.touch, { opacity: value === "false" ? 0.5 : 1 }]}
            >
              สัมผัส
            </Text>
          </Pressable>
        );
      case unit === "sound":
        return (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "true" ? "#b31117" : "transparent",
                },
              ]}
              onPress={() => updateValue(index, "true", sn, unit, order)}
            >
              <FontAwesome5
                name="volume-up"
                color={value === "true" ? "#ffffff" : "#b31117"}
                size={normalize(10) > 14 ? 14 : normalize(10)}
              />
            </Pressable>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor:
                    value === "false" ? "#b31117" : "transparent",
                },
              ]}
              onPress={() => updateValue(index, "false", sn, unit, order)}
            >
              <FontAwesome5
                name="volume-mute"
                color={value === "false" ? "#ffffff" : "#b31117"}
                size={normalize(10) > 14 ? 14 : normalize(10)}
              />
            </Pressable>
          </View>
        );
      case unit === "boolean" && type === "radio":
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => updateValue(index, "true", sn, unit, order)}
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "true" ? "#b31117" : "transparent",
                },
              ]}
            >
              <FontAwesome5
                name="check"
                color={value === "true" ? "#ffffff" : "#b31117"}
                size={normalize(10) > 14 ? 14 : normalize(10)}
              />
            </Pressable>
            <Pressable
              onPress={() => updateValue(index, "false", sn, unit, order)}
              style={[
                styles.input_circle,
                {
                  backgroundColor:
                    value === "false" ? "#b31117" : "transparent",
                },
              ]}
            >
              <FontAwesome5
                name="times"
                color={value === "false" ? "#ffffff" : "#b31117"}
                size={normalize(10) > 14 ? 14 : normalize(10)}
              />
            </Pressable>
          </View>
        );
      case unit === "speed":
        return (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "1" ? "#b31117" : "transparent",
                  height: height * 0.0225,
                  width: height * 0.0225,
                  margin: height * 0.0025,
                },
              ]}
              onPress={() => updateValue(index, "1", sn, unit, order)}
            >
              <Text
                style={[
                  styles.speed,
                  { color: value === "1" ? "#f2f2f2" : "#b31117" },
                ]}
              >
                1
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "2" ? "#b31117" : "transparent",
                  height: height * 0.0225,
                  width: height * 0.0225,
                  margin: height * 0.0025,
                },
              ]}
              onPress={() => updateValue(index, "2", sn, unit, order)}
            >
              <Text
                style={[
                  styles.speed,
                  { color: value === "2" ? "#f2f2f2" : "#b31117" },
                ]}
              >
                2
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "3" ? "#b31117" : "transparent",
                  height: height * 0.0225,
                  width: height * 0.0225,
                  margin: height * 0.0025,
                },
              ]}
              onPress={() => updateValue(index, "3", sn, unit, order)}
            >
              <Text
                style={[
                  styles.speed,
                  { color: value === "3" ? "#f2f2f2" : "#b31117" },
                ]}
              >
                3
              </Text>
            </Pressable>
          </View>
        );
      case unit === "sound_error":
        return (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "true" ? "#b31117" : "transparent",
                },
              ]}
              onPress={() => updateValue(index, "true", sn, unit, order)}
            >
              <FontAwesome5
                name="volume-up"
                color={value === "true" ? "#ffffff" : "#b31117"}
                size={normalize(10) > 14 ? 14 : normalize(10)}
              />
            </Pressable>
            <Pressable
              style={[
                styles.input_circle,
                {
                  backgroundColor:
                    value === "false" ? "#b31117" : "transparent",
                },
              ]}
              onPress={() => updateValue(index, "false", sn, unit, order)}
            >
              <FontAwesome5
                name="volume-mute"
                color={value === "false" ? "#ffffff" : "#b31117"}
                size={normalize(10) > 14 ? 14 : normalize(10)}
              />
            </Pressable>
          </View>
        );
      case unit === "fan_speed":
        return (
          <SelectDropdown
            data={["Low", "Mid", "High", "Hi-Hi", "Turbo"]}
            defaultValue={value}
            buttonStyle={styles.dropdownBtn}
            buttonTextStyle={styles.dropdownBtnText}
            rowStyle={styles.dropdownRowStyle}
            rowTextStyle={styles.dropdownRowText}
            onSelect={(selectedItem, index) => {
              updateValue(index, selectedItem, sn, unit, order);
            }}
          />
        );
      default:
        return (
          <View style={styles.summary_input_container}>
            <TextInput
              style={styles.from_input}
              value={value}
              autoCapitalize="none"
              onChangeText={(val) => updateValue(index, val, sn, unit, order)}
              keyboardType={"numeric"}
            />
            <Text style={styles.summary_input_unit}> {unit}</Text>
          </View>
        );
    }
  };

  const pickImage = async (index, sn, order, unit) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: false,
        // aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        updateValue(index, result.uri, sn, "image", order);

        let token = await AsyncStorage.getItem("token");

        if (
          parseInt(jobType) === 1 ||
          parseInt(jobType) === 2 ||
          parseInt(jobType) === 6
        ) {
          await uploadPic(
            token,
            jobID,
            sn,
            order,
            unit === "before_image" ? result.uri : null,
            unit === "after_image" ? result.uri : null,
            null
          );
        } else {
          await uploadInstallPic(
            token,
            jobID,
            order,
            unit === "before_image" ? result.uri : null,
            unit === "after_image" ? result.uri : null,
            null
          );
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error!", "ีอัพโหลดรูปไม่สำเร็จ");
    }
  };

  const cameraImage = async (index, sn, order, unit) => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: false,
        // aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        updateValue(index, result.uri, sn, "image", order);

        let token = await AsyncStorage.getItem("token");

        if (
          parseInt(jobType) === 1 ||
          parseInt(jobType) === 2 ||
          parseInt(jobType) === 6
        ) {
          await uploadPic(
            token,
            jobID,
            sn,
            order,
            unit === "before_image" ? result.uri : null,
            unit === "after_image" ? result.uri : null,
            null
          );
        } else {
          await uploadInstallPic(
            token,
            jobID,
            order,
            unit === "before_image" ? result.uri : null,
            unit === "after_image" ? result.uri : null,
            null
          );
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error!", "ีอัพโหลดรูปไม่สำเร็จ");
    }
  };

  return data.body.map((item, index) => (
    <View key={index}>
      <View style={styles.report_card}>
        <View style={styles.report_card_header} />
        <Text style={styles.report_label}>{item.title_th}</Text>
        <Pressable
          style={styles.report_expand_btn}
          onPress={() => onPressFunction(index)}
        >
          <View style={styles.report_card_circle} />
          <FontAwesome5
            name="chevron-down"
            color={"#b31117"}
            size={normalize(14) > 18 ? 18 : normalize(14)}
            style={{
              transform: [{ rotate: item.isExpanded ? "180deg" : "0deg" }],
            }}
          />
        </Pressable>
      </View>
      <View
        style={[
          styles.expanded_card,
          {
            height: item.isExpanded ? null : 0,
            marginBottom: item.isExpanded ? height * 0.01 : 0,
            overflow: "hidden",
          },
        ]}
      >
        {item.value.map((data, key) => (
          <View
            key={key}
            style={[
              styles.expanded_card_container,
              {
                flexDirection:
                  data.input_type === "textarea" || data.input_type === "file"
                    ? "column"
                    : "row",
              },
            ]}
          >
            {data.input_type === "textarea" ||
            data.input_type === "file" ? null : (
              <View
                style={[
                  styles.expanded_card_label_container,
                  {
                    borderBottomWidth: item.value.length - 1 === key ? 0 : 1,
                  },
                ]}
              >
                <Text style={styles.expanded_label}>{data.sn}</Text>
              </View>
            )}

            {data.input_type === "textarea" ? (
              <View
                style={[
                  styles.expanded_card_label_container,
                  {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                {data.unit !== "etc" && (
                  <Text style={styles.expanded_label}>{data.title_en}</Text>
                )}
                <TextInput
                  style={[
                    styles.from_input,
                    {
                      marginBottom: height * 0.02,
                      marginTop: height * 0.02,
                      borderColor: data.value ? "rgba(0,0,0,0.75)" : "red",
                    },
                  ]}
                  multiline={true}
                  value={data.value}
                  autoCapitalize="none"
                  onChangeText={(val) => {
                    updateValue(index, val, data.sn, data.unit, data.order);
                    summaryValidate(val.length ? true : false);
                  }}
                />
              </View>
            ) : data.input_type === "file" ? (
              <View
                style={[
                  styles.expanded_card_label_container,
                  {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <View
                  style={[
                    styles.expanded_card_image_button_container,
                    { borderTopRightRadius: key === 0 ? height * 0.005 : 0 },
                  ]}
                >
                  <View style={{ flex: 7.5, minHeight: height * 0.04 }}>
                    {jobType === "6" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "baseline",
                        }}
                      >
                        <Text style={styles.expanded_title}>ห้อง</Text>
                        <TextInput
                          style={styles.title_input}
                          onChangeText={(val) =>
                            updateTitle(
                              index,
                              val,
                              data.sn,
                              data.unit,
                              data.order
                            )
                          }
                          defaultValue={data.title_en}
                        />
                      </View>
                    ) : (
                      <Text style={styles.expanded_label}>
                        {jobType === "1" || jobType === "2"
                          ? data.title_en + " - " + data.sn
                          : data.title_en}
                      </Text>
                    )}
                  </View>
                  <View style={styles.image_button_container}>
                    <Pressable
                      onPress={() =>
                        cameraImage(index, data.sn, data.order, data.unit)
                      }
                    >
                      <MaterialCommunityIcons
                        name="camera"
                        color="#ffffff"
                        size={normalize(20) > 30 ? 30 : normalize(20)}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        pickImage(index, data.sn, data.order, data.unit)
                      }
                    >
                      <MaterialCommunityIcons
                        name="folder-multiple-image"
                        color="#ffffff"
                        size={normalize(20) > 30 ? 30 : normalize(20)}
                      />
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    setModalVisible(true);
                    setImageUri(
                      data.uri
                        ? data.uri
                        : data.value
                        ? data.unit === "after_image"
                          ? "https://api.saijo-denki.com/img/club/upload/after/" +
                            data.value +
                            "?" +
                            new Date()
                          : "https://api.saijo-denki.com/img/club/upload/before/" +
                            data.value +
                            "?" +
                            new Date()
                        : null
                    );
                    setModalTitle(
                      jobType === "1" || jobType === "2"
                        ? data.title_th + " - " + data.sn
                        : data.title_th
                    );
                  }}
                >
                  <Image
                    source={{
                      uri: data.uri
                        ? data.uri
                        : data.value
                        ? data.unit === "after_image"
                          ? "https://api.saijo-denki.com/img/club/upload/after/" +
                            data.value +
                            "?" +
                            new Date()
                          : "https://api.saijo-denki.com/img/club/upload/before/" +
                            data.value +
                            "?" +
                            new Date()
                        : null,
                    }}
                    style={[
                      styles.report_image,
                      {
                        height: data.uri
                          ? height * 0.25
                          : data.value
                          ? height * 0.25
                          : 0,
                      },
                    ]}
                  />
                </Pressable>
                {data.staff_comment.length ? (
                  <Text style={styles.expanded_label}>
                    {data.staff_comment.length}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.expanded_value_container}>
                <View style={styles.report_card_circle} />

                {outputFormat(
                  data.value,
                  data.input_type,
                  data.unit,
                  index,
                  data.sn,
                  data.order
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  ));
};

const SummaryScreen = ({ navigation, route }) => {
  const [listData, setListData] = useState([]);
  const [jobType] = useState(
    route.params?.job_type ? route.params.job_type : 0
  );
  const [jobID] = useState(route.params?.job_id ? route.params.job_id : 517);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalSign, setModalSign] = useState(false);
  const [summaryValidate, setSummaryValidate] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const ref = useRef();
  const scrollViewRef = useRef();

  const isFocused = useIsFocused();

  useEffect(() => {
    const findType = (data) => {
      let x = data.map((i) => {
        let y = i.value.filter((j) => {
          return j.input_type === "file" || j.input_type === "textarea";
        });

        if (y.length) {
          i.show = false;
        } else {
          i.show = true;
        }

        return i;
      });

      let a = x.filter((i) => i.show === true);

      return a.length ? true : false;
    };

    (async () => {
      try {
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
      } catch (error) {
        console.log(error);
      }

      try {
        let token = await AsyncStorage.getItem("token");

        let res = await summaryForm(token, jobID);
        let report = res.data.data;

        var result = report.map((data) => ({
          ...data,
          show: findType(data.body),
          body: data.body.map((item) => ({
            ...item,
            isExpanded: true,
          })),
        }));

        setListData(result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // Alert.alert("Warring!", "Permission to access location was denied.");

        return;
      } else {
        setLocationStatus("granted");
      }
    })();
  }, []);

  const updateLayout = (index, sub_index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listData];

    array[index]["body"][sub_index]["isExpanded"] =
      !array[index]["body"][sub_index]["isExpanded"];

    setListData(array);
  };

  const updateValue = (index, sub_index, value, serial, type, order) => {
    let result = listData.map((item, key) => {
      item.body.map((data, sub_key) => {
        if (index === key && sub_index === sub_key) {
          data.value.map((sub_data, k) => {
            if (sub_data.sn === serial) {
              if (type !== "image") {
                sub_data.value = value;
              } else {
                if (k === parseInt(order)) {
                  if (
                    parseInt(jobType) === 1 ||
                    parseInt(jobType) === 2 ||
                    parseInt(jobType) === 6
                  ) {
                    sub_data.value =
                      jobID + "_" + serial + "_" + order + ".png";
                    sub_data.uri = value;
                  } else {
                    sub_data.value = jobID + "_" + order + ".png";
                    sub_data.uri = value;
                  }
                }
              }
            }

            return sub_data;
          });
        }

        return data;
      });

      return item;
    });

    setListData(result);
  };

  const updateTitle = (index, sub_index, value, serial, type, order) => {
    let result = listData.map((item, key) => {
      item.body.map((data, sub_key) => {
        if (index === key && sub_index === sub_key) {
          data.value.map((sub_data, k) => {
            if (k === parseInt(order)) {
              sub_data.title_en = value;
              sub_data.title_th = value;
            }

            return sub_data;
          });
        }

        return data;
      });

      return item;
    });

    setListData(result);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleOK = (signature) => {
    const path = FileSystem.cacheDirectory + "sign.png";
    FileSystem.writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      { encoding: FileSystem.EncodingType.Base64 }
    )
      .then(() => FileSystem.getInfoAsync(path))
      .then(async (e) => {
        setLoading(true);

        if (parseInt(jobType) === 1 || parseInt(jobType) === 2) {
          try {
            let token = await AsyncStorage.getItem("token");
            await uploadPic(token, jobID, "", "0", null, null, e.uri);
          } catch (error) {
            console.log(error.response.data.message);
          }
        } else {
          try {
            let token = await AsyncStorage.getItem("token");
            await uploadInstallPic(token, jobID, "0", null, null, e.uri);
          } catch (error) {
            console.log(error.response);
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        let result = listData.map((item) => {
          delete item["show"];

          item.body.map((data) => {
            delete data["isExpanded"];

            data.value.map((sub_data) => {
              delete sub_data["uri"];

              return sub_data;
            });

            return data;
          });

          return item;
        });

        (async () => {
          try {
            let token = await AsyncStorage.getItem("token");

            if (locationStatus === "granted") {
              //   let location = await Location.getCurrentPositionAsync({});
              //   await checkOut(
              //     token,
              //     jobID,
              //     location.coords.latitude,
              //     location.coords.longitude
              //   );
            }

            await saveSummaryForm(token, jobID, result);

            setModalSign(false);
            setLoading(false);
            setPage(1);

            navigation.navigate({
              name: "Review",
              params: {
                job_id: jobID,
              },
            });
          } catch (error) {
            console.log(error);

            Alert.alert("Error!", "บันทึกไม่สำเร็จ");
          }
        })();
      });
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };

  const imgWidth = "100%";
  const imgHeight = height * 0.2;
  const style = `.m-signature-pad {box-shadow: none; border: none; } 
                .m-signature-pad--body {border: none;}
                .m-signature-pad--footer {display: none; margin: 0px;}
                body,html {
                width: ${imgWidth}px; height: ${imgHeight}px;}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.report_sub_header}>
        ข้อกำหนดในการตรวจสอบ รอให้เครื่องทำงานอย่างน้อย 10 นาที
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : ""}
        keyboardVerticalOffset={height * 0.1}
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <ScrollView
          style={{
            width: "100%",
            marginTop: height * 0.01,
          }}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          {page === 1 && (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ width: width, alignItems: "center" }}>
                {listData.map((item, index) => (
                  <View key={index} style={styles.report_container}>
                    <Text
                      style={[
                        styles.report_title,
                        { marginTop: 0, display: item.show ? "flex" : "none" },
                      ]}
                    >
                      {item.header_th}
                    </Text>
                    {item.show && (
                      <ExpandableComponent
                        data={item}
                        onPressFunction={(val) => updateLayout(index, val)}
                        jobType={jobType}
                        setModalVisible={setModalVisible}
                        setImageUri={setImageUri}
                        setModalTitle={setModalTitle}
                        updateValue={(key, val, serial, unit, order) =>
                          updateValue(index, key, val, serial, unit, order)
                        }
                        updateTitle={(key, val, serial, unit, order) =>
                          updateTitle(index, key, val, serial, unit, order)
                        }
                        summaryValidate={setSummaryValidate}
                        jobID={jobID}
                      />
                    )}
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>
          )}
          {page === 2 && (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ width: width, alignItems: "center" }}>
                {listData.map((item, index) => (
                  <View key={index} style={styles.report_container}>
                    <Text
                      style={[
                        styles.report_title,
                        { marginTop: 0, display: !item.show ? "flex" : "none" },
                      ]}
                    >
                      {item.header_th}
                    </Text>
                    {!item.show && (
                      <ExpandableComponent
                        data={item}
                        onPressFunction={(val) => updateLayout(index, val)}
                        jobType={jobType}
                        setModalVisible={setModalVisible}
                        setImageUri={setImageUri}
                        setModalTitle={setModalTitle}
                        updateValue={(key, val, serial, unit, order) =>
                          updateValue(index, key, val, serial, unit, order)
                        }
                        updateTitle={(key, val, serial, unit, order) =>
                          updateTitle(index, key, val, serial, unit, order)
                        }
                        summaryValidate={setSummaryValidate}
                        jobID={jobID}
                      />
                    )}
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {page === 1 && (
        <View style={styles.button_container}>
          <Pressable
            style={styles.cancel_button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancel_text}>ยกเลิก</Text>
          </Pressable>
          <Pressable
            style={styles.view_sign_button}
            onPress={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              setPage(2);
            }}
          >
            <Text style={styles.button_text}>ต่อไป</Text>
          </Pressable>
        </View>
      )}
      {page === 2 && (
        <View style={styles.button_container}>
          <Pressable
            style={styles.cancel_button}
            onPress={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              setPage(1);
            }}
          >
            <Text style={styles.cancel_text}>ย้อนกลับ</Text>
          </Pressable>
          <Pressable
            style={styles.view_sign_button}
            onPress={() => {
              summaryValidate
                ? setModalSign(true)
                : Alert.alert(
                    "คำเตือน!",
                    'กรุณาสรุปงานในช่อง "สรุปผลการทำงาน" ก่อนทำการลงลายเซ็น'
                  );
              summaryValidate
                ? null
                : scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
          >
            <Text style={styles.button_text}>ยืนยัน</Text>
          </Pressable>
        </View>
      )}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <View style={styles.modal_header}>
              <Text style={styles.modal_header_text}>{modalTitle}</Text>
              <Pressable
                style={styles.close_modal_btn}
                onPress={() => {
                  setModalVisible(false);
                  setImageUri("");
                  setModalTitle("");
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  color="#ffffff"
                  size={normalize(20) > 30 ? 30 : normalize(20)}
                />
              </Pressable>
            </View>
            <View style={styles.modal_body}>
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.modal_report_image}
                resizeMode={"cover"}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalSign}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <View style={styles.modal_header}>
              <Text style={styles.modal_header_text}>
                ยืนยันรายงานผลการตรวจสอบบริการ
              </Text>
              <Pressable
                style={styles.close_modal_btn}
                onPress={() => {
                  setModalSign(false);
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  color="#ffffff"
                  size={normalize(20) > 30 ? 30 : normalize(20)}
                />
              </Pressable>
            </View>
            <View
              style={[
                styles.modal_body,
                {
                  paddingLeft: "6%",
                  paddingRight: "6%",
                  paddingTop: "3%",
                  paddingBottom: "3%",
                },
              ]}
            >
              <Text style={styles.sign_title}>ลงชื่อ</Text>
              <View style={styles.sign_container}>
                <SignatureScreen
                  ref={ref}
                  webStyle={style}
                  onOK={handleOK}
                  backgroundColor={"rgba(255,255,255,1)"}
                />
                <View style={styles.sign_bar} />
                <Pressable
                  style={styles.remove_signature_btn}
                  onPress={handleClear}
                >
                  <Text style={styles.remove_signature_text}>X ลบลายเซ็น</Text>
                </Pressable>
              </View>
              <View style={styles.button_sign_container}>
                <Pressable
                  style={styles.cancel_sign_button}
                  onPress={() => {
                    handleClear;
                    setModalSign(false);
                  }}
                >
                  <Text style={styles.cancel_text}>ยกเลิก</Text>
                </Pressable>
                <Pressable
                  style={styles.confirm_sign_button}
                  onPress={handleConfirm}
                >
                  <Text style={styles.button_text}>ยืนยัน</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={loading}>
        <View style={styles.modal_background}>
          <ActivityIndicator size="large" color={"#999999"} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SummaryScreen;
