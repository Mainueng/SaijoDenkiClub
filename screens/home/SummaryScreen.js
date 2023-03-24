import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import styles from "../../assets/stylesheet/home/summary";
import SelectDropdown from "react-native-select-dropdown";
import SignatureScreen from "react-native-signature-canvas";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import {
  summaryForm,
  saveSummaryForm,
  uploadPic,
  uploadInstallPic,
} from "../../api/summary";
import { useFocusEffect } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const ExpandableComponent = ({
  data,
  jobID,
  jobType,
  setModalVisible,
  setImageUri,
  setModalTitle,
  summaryValidate,
  toggleReportInput,
  updateValue,
  updateTitle,
  removeImage,
}) => {
  const [modal, setModal] = useState(false);
  const [indexData, setIndexData] = useState(0);
  const [imageSN, setImageSN] = useState("");
  const [imageOrder, setImageOrder] = useState(0);
  const [imageUnit, setImageUnit] = useState("");

  useEffect(() => {
    data.body.map((item) => {
      item.value.map((data) => {
        if (data.input_type === "textarea") {
          if (data.value.trim().length) {
            summaryValidate(data.value.trim().length ? true : false);
          }
        }
      });
    });
  }, []);

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
                styles.inputCircle,
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
                styles.inputCircle,
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
                styles.inputCircle,
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
                styles.inputCircle,
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
            <SelectDropdown
              data={["1", "2", "3"]}
              defaultValue={value}
              buttonStyle={styles.dropdownBtn}
              buttonTextStyle={styles.dropdownBtnText}
              rowStyle={styles.dropdownRowStyle}
              rowTextStyle={styles.dropdownRowText}
              onSelect={(selectedItem, index) => {
                updateValue(index, selectedItem, sn, unit, order);
              }}
            />
          </View>
        );
      case unit === "sound_error":
        return (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={[
                styles.inputCircle,
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
                styles.inputCircle,
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
          <View style={styles.summaryInputContainer}>
            <TextInput
              style={styles.fromInput}
              value={value}
              autoCapitalize="none"
              onChangeText={(val) => updateValue(index, val, sn, unit, order)}
              keyboardType={"numeric"}
            />
            <Text style={styles.summaryInputUnit}> {unit}</Text>
          </View>
        );
    }
  };

  const pickImage = async () => {
    setModal(false);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        updateValue(
          indexData,
          result.assets[0].uri,
          imageSN,
          imageUnit,
          imageOrder
        );

        let token = await AsyncStorage.getItem("token");
        let info = await FileSystem.getInfoAsync(result.assets[0].uri);
        let imageType = getUrlExtension(info.uri);

        // if (jobType === 1 || jobType === 2) {
        //   await uploadPic(
        //     token,
        //     jobID,
        //     imageSN,
        //     imageOrder,
        //     imageUnit === "before_image" ? result.assets[0].uri : null,
        //     imageUnit === "after_image" ? result.assets[0].uri : null,
        //     null,
        //     imageType
        //   );

        //   Alert.alert(t("success"), t("uploadSuccess"));
        // } else {
        await uploadInstallPic(
          token,
          jobID,
          imageOrder,
          imageUnit === "before_image" ? result.assets[0].uri : null,
          imageUnit === "after_image" ? result.assets[0].uri : null,
          null,
          imageType
        );

        Alert.alert("สำเร็จ", "อัพโหลดสำเร็จ");
        //  }
      }
    } catch (e) {
      Alert.alert("ล้มเหลว", " อัพโหลดไม่สำเร็จ");
      console.log(e);
    }
  };

  const cameraImage = async () => {
    setModal(false);
    try {
      await Camera.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        updateValue(
          indexData,
          result.assets[0].uri,
          imageSN,
          imageUnit,
          imageOrder
        );

        let token = await AsyncStorage.getItem("token");
        let info = await FileSystem.getInfoAsync(result.assets[0].uri);
        let imageType = getUrlExtension(info.uri);

        // if (jobType === 1 || jobType === 2) {
        //   await uploadPic(
        //     token,
        //     jobID,
        //     sn,
        //     order,
        //     unit === "before_image" ? result.assets[0].uri : null,
        //     unit === "after_image" ? result.assets[0].uri : null,
        //     null,
        //     imageType
        //   );

        //   Alert.alert(t("success"), t("uploadSuccess"));
        // } else {

        await uploadInstallPic(
          token,
          jobID,
          imageOrder,
          imageUnit === "before_image" ? result.assets[0].uri : null,
          imageUnit === "after_image" ? result.assets[0].uri : null,
          null,
          imageType
        );

        Alert.alert("สำเร็จ", "อัพโหลดสำเร็จ");
        //  }
      }
    } catch (e) {
      Alert.alert("ล้มเหลว", " อัพโหลดไม่สำเร็จ");
      console.log(e);
    }
  };

  const getUrlExtension = (uri) => {
    return uri.split(/[#?]/)[0].split(".").pop().trim();
  };

  return (
    <>
      {data.body.length
        ? data.body.map((item, index) => (
            <View key={index}>
              <View style={styles.reportCard}>
                <View style={styles.reportCardHeader}></View>
                <Text style={styles.reportLabel}>{item.title_th}</Text>
                <Pressable
                  style={styles.reportExpandBtn}
                  onPress={() => toggleReportInput(index)}
                >
                  <FontAwesome5
                    name="chevron-down"
                    color={"#b31117"}
                    size={normalize(14) > 18 ? 18 : normalize(14)}
                    style={{
                      transform: [
                        { rotate: item.isExpanded ? "180deg" : "0deg" },
                      ],
                    }}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  width: width * 0.9,
                }}
              >
                {item.value.map((data, key) => (
                  <View
                    key={key}
                    style={{
                      height: item.isExpanded ? null : 0,
                      marginBottom: item.isExpanded ? 10 : 0,
                      overflow: "hidden",
                    }}
                  >
                    {data.input_type === "file" ? (
                      data.uri || data.value ? (
                        <>
                          <View
                            style={{
                              width: width * 0.9,
                              flexDirection: "row",
                              marginTop: 10,
                            }}
                          >
                            <Pressable
                              style={{ position: "relative" }}
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
                                  jobType === 1 || jobType === 2
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
                                style={{
                                  marginHorizontal: 5,
                                  height: data.uri
                                    ? (width * 0.9) / 3 - 10
                                    : data.value
                                    ? (width * 0.9) / 3 - 10
                                    : 0,
                                  width: data.uri
                                    ? (width * 0.9) / 3 - 10
                                    : data.value
                                    ? (width * 0.9) / 3 - 10
                                    : 0,
                                  borderRadius: 8,
                                }}
                              />
                              <Pressable
                                style={styles.removeImage}
                                onPress={() => {
                                  removeImage(index, data.order);
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="trash-can-outline"
                                  color={"#cccccc"}
                                  size={normalize(20)}
                                />
                              </Pressable>
                            </Pressable>
                            <View style={styles.imageDescriptionContainer}>
                              <Text style={styles.inputLabel}>รายละเอียด</Text>
                              <TextInput
                                style={styles.input}
                                placeholder={"ระบุรายละเอียด"}
                                placeholderTextColor="rgba(102,102,102,0.5)"
                                autoCapitalize="none"
                                onChangeText={(val) =>
                                  updateTitle(index, val, data.order)
                                }
                                multiline={true}
                                defaultValue={data.title_th}
                              />
                            </View>
                          </View>
                          {data.staff_checked === "ไม่ผ่าน" ? (
                            <Text
                              style={[
                                styles.expandedLabel,
                                {
                                  marginHorizontal: 5,
                                  marginTop: 10,
                                  padding: 0,
                                  color: "#b31117",
                                },
                              ]}
                            >
                              {"หมายเหตุ " + data.staff_comment}
                            </Text>
                          ) : null}
                        </>
                      ) : (
                        <Pressable
                          style={styles.uploadImageBtn}
                          onPress={() => {
                            setIndexData(index);
                            setImageSN(data.sn);
                            setImageOrder(data.order);
                            setImageUnit(data.unit);
                            setModal(true);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            color={"#cccccc"}
                            size={normalize(50)}
                          />
                        </Pressable>
                      )
                    ) : (
                      <View
                        key={key}
                        style={[
                          styles.expandedCard,
                          {
                            height: item.isExpanded ? null : 0,
                            marginBottom: item.isExpanded ? 10 : 0,
                            overflow: "hidden",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.expandedCardContainer,
                            {
                              flexDirection:
                                data.input_type === "textarea"
                                  ? "column"
                                  : "row",
                            },
                          ]}
                        >
                          {data.input_type === "textarea" ? null : (
                            <View
                              style={[
                                styles.expandedCardLabelContainer,
                                {
                                  borderBottomWidth:
                                    item.value.length - 1 === key ? 0 : 1,
                                },
                              ]}
                            >
                              <Text style={styles.expandedLabel}>
                                {data.sn}
                              </Text>
                            </View>
                          )}
                          {data.input_type === "textarea" ? (
                            <View
                              style={{
                                borderWidth: data.value.trim().length ? 0 : 1,
                                borderColor: "#b31117",
                                borderRadius: 8,
                              }}
                            >
                              <View style={styles.imageDescriptionContainer}>
                                <Text style={styles.inputLabel}>
                                  {data.unit !== "etc" && data.title_en
                                    ? data.title_en + " "
                                    : null}
                                  รายละเอียด
                                </Text>
                                <TextInput
                                  style={styles.input}
                                  placeholder={"ระบุรายละเอียด"}
                                  placeholderTextColor="rgba(102,102,102,0.5)"
                                  autoCapitalize="none"
                                  onChangeText={(val) => {
                                    updateValue(
                                      index,
                                      val,
                                      data.sn,
                                      data.unit,
                                      data.order
                                    );
                                    summaryValidate(
                                      val.trim().length ? true : false
                                    );
                                  }}
                                  multiline={true}
                                  defaultValue={data.value}
                                />
                              </View>
                            </View>
                          ) : (
                            <View style={styles.expandedValueContainer}>
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
                      </View>
                    )}
                    {data.staff_comment.length ? (
                      <Text style={styles.expandedLabel}>
                        {data.staff_comment}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ))
        : null}
      <Modal animationType="fade" transparent={true} visible={modal}>
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalBodyContainer,
              {
                width: undefined,
                borderRadius: 8,
                paddingHorizontal: 0,
                paddingTop: 0,
                paddingBottom: 0,
              },
            ]}
          >
            <Text style={styles.modalTitle}>{"เปลี่ยนรูปโปรไฟล์ของคุณ"}</Text>
            <Pressable style={styles.modalBtn} onPress={() => cameraImage()}>
              <Text style={styles.modalBtnText}>{"กล้อง"}</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={() => pickImage()}>
              <Text style={styles.modalBtnText}>{"อัลบั้มรูป"}</Text>
            </Pressable>
            <Pressable style={styles.modalBtn} onPress={() => setModal(false)}>
              <Text style={styles.modalBtnText}>{"ยกเลิก"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const SummaryScreen = ({ navigation, route }) => {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSign, setModalSign] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [summaryValidate, setSummaryValidate] = useState(false);
  const [loading, setLoading] = useState(false);

  const jobType = route.params?.job_type ? route.params.job_type : 0;
  const jobID = route.params?.job_id ? route.params.job_id : 0;

  const ref = useRef();
  const scrollViewRef = useRef();

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const imgWidth = "100%";
  const imgHeight = height * 0.2;
  const stylePad = `.m-signature-pad {width: 100%; margin-top:0; margin-left: 0; box-shadow: none; border: none} 
                .m-signature-pad--body {border: none;}
                .m-signature-pad--footer {display: none; margin: 0px;}
                body,html {
                width: ${imgWidth}px; height: ${imgHeight}px;}`;

  useFocusEffect(
    useCallback(() => {
      setPage(1);

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
          let token = await AsyncStorage.getItem("token");
          let res = await summaryForm(token, jobID);
          let report = res.data.data;

          let result = report.map((data) => ({
            ...data,
            show: findType(data.body),
            body: data.body.map((item) => ({
              ...item,
              isExpanded: true,
            })),
          }));

          setListData(result);
        } catch (e) {
          console.log(e);
        }
      })();
    }, [])
  );

  const updateLayout = (index, subIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listData];

    array[index]["body"][subIndex]["isExpanded"] =
      !array[index]["body"][subIndex]["isExpanded"];

    setListData(array);
  };

  const updateValue = (index, subIndex, value, serial, unit, order) => {
    let result = listData.map((item, key) => {
      item.body.map((data, sub_key) => {
        if (index === key && subIndex === sub_key) {
          data.value.map((subData, k) => {
            if (subData.sn === serial) {
              if (unit !== "before_image" && unit !== "after_image") {
                subData.value = value;
              } else {
                if (k === parseInt(order)) {
                  if (
                    parseInt(jobType) === 1 ||
                    parseInt(jobType) === 2
                    // parseInt(jobType) === 6
                  ) {
                    subData.value = jobID + "_" + serial + "_" + order + ".png";
                    subData.uri = value;
                  } else {
                    subData.value = jobID + "_" + order + ".png";
                    subData.uri = value;
                  }
                }
              }
            }

            return subData;
          });

          if (unit === "before_image" || unit === "after_image") {
            data.value.push({
              title_en: "",
              title_th: "",
              sn: "",
              value: "",
              input_type: "file",
              unit: unit,
              order: order * 1 + 1,
              staff_checked: "",
              staff_comment: "",
            });
          }
        }

        return data;
      });

      return item;
    });

    setListData(result);
  };

  const updateTitle = (index, subIndex, value, order) => {
    let result = listData.map((item, key) => {
      item.body.map((data, sub_key) => {
        if (index === key && subIndex === sub_key) {
          data.value.map((subData, k) => {
            if (k === parseInt(order)) {
              subData.title_en = value;
              subData.title_th = value;
            }

            return subData;
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

  const handleConfirm = () => {
    ref.current.readSignature();
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

        if (jobType === 1 || jobType === 2) {
          try {
            let token = await AsyncStorage.getItem("token");
            await uploadPic(token, jobID, "", "0", null, null, e.uri, null);
          } catch (error) {
            console.log(error.response.data.message);
          }
        } else {
          try {
            let token = await AsyncStorage.getItem("token");
            await uploadInstallPic(token, jobID, "0", null, null, e.uri, null);
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

            await saveSummaryForm(token, jobID, result);

            setModalSign(false);
            setLoading(false);
            setPage(1);

            navigation.navigate({
              name: "Review",
              params: {
                job_id: jobID,
                job_type: jobType,
              },
            });
          } catch (error) {
            console.log(error);
            setModalSign(false);
            setLoading(false);

            Alert.alert("เกิดข้อผิดพลาด", "บันทึกไม่สำเร็จ");
          }
        })();
      });
  };

  const removeImage = (index, subIndex, order) => {
    let result = listData.map((item, key) => {
      item.body.map((data, sub_key) => {
        if (index === key && subIndex === sub_key) {
          data.value = data.value.filter((i) => {
            return i.order != order;
          });

          data.value.map((i, j) => {
            i.order = j;

            return i;
          });
        }
        return data;
      });
      return item;
    });

    setListData(result);
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.summaryFormContainer}>
          <Text style={styles.reportHeader}>
            {"ข้อกำหนดในการตรวจสอบ รอให้เครื่องทำงานอย่างน้อย 10 นาที"}
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={height < 900 ? height * 0.15 : height * 0.1}
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <ScrollView
              style={{
                width: "100%",
              }}
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
            >
              {page === 1 && (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.formContainer}>
                    {listData.map((item, index) => (
                      <View key={index}>
                        <Text
                          style={[
                            styles.formTitle,
                            { display: item.show ? "flex" : "none" },
                          ]}
                        >
                          {item.header_th}
                        </Text>
                        {item.show && (
                          <ExpandableComponent
                            data={item}
                            jobID={jobID}
                            jobType={jobType}
                            setModalVisible={setModalVisible}
                            setImageUri={setImageUri}
                            setModalTitle={setModalTitle}
                            summaryValidate={setSummaryValidate}
                            toggleReportInput={(val) =>
                              updateLayout(index, val)
                            }
                            updateValue={(key, val, serial, unit, order) =>
                              updateValue(index, key, val, serial, unit, order)
                            }
                            updateTitle={(key, val, order) =>
                              updateTitle(index, key, val, order)
                            }
                          />
                        )}
                      </View>
                    ))}
                  </View>
                </TouchableWithoutFeedback>
              )}
              {page === 2 && (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.formContainer}>
                    {listData.map((item, index) => (
                      <View key={index}>
                        <Text
                          style={[
                            styles.formTitle,
                            { display: !item.show ? "flex" : "none" },
                          ]}
                        >
                          {item.header_th}
                        </Text>
                        {!item.show && (
                          <ExpandableComponent
                            data={item}
                            jobID={jobID}
                            jobType={jobType}
                            setModalVisible={setModalVisible}
                            setImageUri={setImageUri}
                            setModalTitle={setModalTitle}
                            summaryValidate={setSummaryValidate}
                            toggleReportInput={(val) =>
                              updateLayout(index, val)
                            }
                            updateValue={(key, val, serial, unit, order) =>
                              updateValue(index, key, val, serial, unit, order)
                            }
                            updateTitle={(key, val, order) =>
                              updateTitle(index, key, val, order)
                            }
                            removeImage={(key, order) =>
                              removeImage(index, key, order)
                            }
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
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelText}>ยกเลิก</Text>
              </Pressable>
              <Pressable
                style={styles.confirmBtn}
                onPress={() => {
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  setPage(2);
                }}
              >
                <Text style={styles.confirmText}>{"ต่อไป"}</Text>
              </Pressable>
            </View>
          )}
          {page === 2 && (
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  setPage(1);
                }}
              >
                <Text style={styles.cancelText}>{"ย้อนกลับ"}</Text>
              </Pressable>
              <Pressable
                style={styles.confirmBtn}
                onPress={() => {
                  summaryValidate
                    ? setModalSign(true)
                    : Alert.alert(
                        "คำเตือน",
                        "กรุณาสรุปงานในช่อง 'สรุปผลการทำงาน' ก่อนทำการลงลายเซ็น"
                      );
                  summaryValidate
                    ? null
                    : scrollViewRef.current?.scrollToEnd({ animated: true });
                }}
              >
                <Text style={styles.confirmText}>{"ยืนยัน"}</Text>
              </Pressable>
            </View>
          )}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onDismiss={() => {
            setImageUri("");
            setModalTitle("");
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeaderContainer}>
                <View style={styles.modalHeaderTitleContainer}>
                  <Text style={styles.modalHeaderTitle}>
                    {jobType === 1 || jobType === 2 ? modalTitle : ""}
                  </Text>
                </View>
                <Pressable
                  style={styles.closeModalBtn}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={26}
                    color={"#ffffff"}
                  />
                </Pressable>
              </View>
              <View
                style={[
                  styles.modalBodyContainer,
                  {
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                    justifyContent: "center",
                  },
                ]}
              >
                <Image
                  source={{
                    uri: imageUri,
                  }}
                  style={styles.modalReportImage}
                  resizeMode={"contain"}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={modalSign}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeaderContainer}>
                <View style={styles.modalHeaderTitleContainer}>
                  <Text style={styles.modalHeaderTitle}>
                    ยืนยันรายงานผลการตรวจสอบบริการ
                  </Text>
                </View>
                <Pressable
                  style={styles.closeModalBtn}
                  onPress={() => {
                    setModalSign(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={26}
                    color={"#ffffff"}
                  />
                </Pressable>
              </View>
              <View
                style={[
                  styles.modalBodyContainer,
                  {
                    paddingHorizontal: 25,
                  },
                ]}
              >
                <Text style={styles.signTitle}>ลงชื่อ</Text>
                <View style={styles.signContainer}>
                  <SignatureScreen
                    ref={ref}
                    webStyle={stylePad}
                    onOK={handleOK}
                    backgroundColor={"rgba(255,255,255,1)"}
                  />
                  <View style={styles.signBar} />
                  <Pressable
                    style={styles.removeSignatureBtn}
                    onPress={handleClear}
                  >
                    <Text style={styles.removeSignatureText}>X ลบลายเซ็น</Text>
                  </Pressable>
                </View>
                <View style={[styles.buttonContainer, { marginBottom: 0 }]}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => {
                      handleClear;
                      setModalSign(false);
                    }}
                  >
                    <Text style={styles.cancelText}>ยกเลิก</Text>
                  </Pressable>
                  <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                    <Text style={styles.confirmText}>ยืนยัน</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          <Modal animationType="fade" transparent={true} visible={loading}>
            <View style={styles.modalBackground}>
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#999999" />
                <Text style={styles.processingText}>โปรดรอ...</Text>
              </View>
            </View>
          </Modal>
        </Modal>
      </SafeAreaView>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: "#f2f2f2",
        }}
      />
    </Fragment>
  );
};

export default SummaryScreen;
