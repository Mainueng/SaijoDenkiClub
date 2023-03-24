import React, { useState, useEffect, useRef, Fragment } from "react";
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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from "../../components/font";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import styles from "../../assets/stylesheet/home/summary";
import { summaryForm } from "../../api/summary";

const { height, width } = Dimensions.get("window");

const ExpandableComponent = ({
  data,
  jobType,
  setModalVisible,
  setImageUri,
  setModalTitle,
  toggleReportInput,
}) => {
  const outputFormat = (value, type, unit) => {
    switch (true) {
      case unit === "touch":
        return (
          <Text
            style={[styles.touch, { opacity: value === "false" ? 0.5 : 1 }]}
          >
            สัมผัส
          </Text>
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
          <Text
            style={[styles.expandedLabel, { paddingRight: 0 }]}
            numberOfLines={1}
          >
            {value}
          </Text>
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
          <Text
            style={[styles.expandedLabel, { paddingRight: 0 }]}
            numberOfLines={1}
          >
            {value}
          </Text>
        );
      default:
        return (
          <Text
            style={[styles.expandedLabel, { paddingRight: 0 }]}
            numberOfLines={1}
          >
            {value + " " + unit}
          </Text>
        );
    }
  };

  return data.body.length
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
                  transform: [{ rotate: item.isExpanded ? "180deg" : "0deg" }],
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
                        </Pressable>
                        <View style={styles.imageDescriptionContainer}>
                          <Text style={styles.inputLabel}>รายละเอียด</Text>
                          <TextInput
                            style={styles.input}
                            placeholder={"รายละเอียด"}
                            placeholderTextColor="rgba(102,102,102,0.5)"
                            autoCapitalize="none"
                            multiline={true}
                            defaultValue={data.title_th}
                            editable={false}
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
                          {"หมายเหตุ: " + data.staff_comment}
                        </Text>
                      ) : null}
                    </>
                  ) : null
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
                            data.input_type === "textarea" ? "column" : "row",
                        },
                      ]}
                    >
                      {data.input_type === "textarea" ||
                      data.input_type === "file" ? null : (
                        <View
                          style={[
                            styles.expandedCardLabelContainer,
                            {
                              borderBottomWidth:
                                item.value.length - 1 === key ? 0 : 1,
                            },
                          ]}
                        >
                          <Text style={styles.expandedLabel}>{data.sn}</Text>
                        </View>
                      )}
                      {data.input_type === "textarea" ? (
                        <View>
                          <View style={styles.imageDescriptionContainer}>
                            <Text style={styles.inputLabel}>
                              {data.unit !== "etc" && data.title_en
                                ? data.title_en + " "
                                : null}
                              รายละเอียด
                            </Text>
                            <TextInput
                              style={styles.input}
                              placeholder={"รายละเอียด"}
                              placeholderTextColor="rgba(102,102,102,0.5)"
                              autoCapitalize="none"
                              editable={false}
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
              </View>
            ))}
          </View>
        </View>
      ))
    : null;
};

const ReportScreen = ({ navigation, route }) => {
  const [listData, setListData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalSign, setModalSign] = useState(false);
  const [page, setPage] = useState(1);

  const jobType = route.params?.job_type ? route.params.job_type : 0;
  const jobID = route.params?.job_id ? route.params.job_id : 0;

  const scrollViewRef = useRef();

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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
  }, []);

  const updateLayout = (index, subIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listData];

    array[index]["body"][subIndex]["isExpanded"] =
      !array[index]["body"][subIndex]["isExpanded"];

    setListData(array);
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.summaryFormContainer}>
          <Text style={styles.reportHeader}>
            ข้อกำหนดในการตรวจสอบ รอให้เครื่องทำงานอย่างน้อย 10 นาที
          </Text>
          <ScrollView
            style={{
              width: "100%",
            }}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {page === 1 && (
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
                        toggleReportInput={(val) => updateLayout(index, val)}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}
            {page === 2 && (
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
                        toggleReportInput={(val) => updateLayout(index, val)}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
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
                <Text style={styles.confirmText}>ต่อไป</Text>
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
                <Text style={styles.cancelText}>ย้อนกลับ</Text>
              </Pressable>
              <Pressable
                style={styles.confirmBtn}
                onPress={() => {
                  setModalSign(true);
                }}
              >
                <Text style={styles.confirmText}>ดูลายเซ็น</Text>
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
                  <View style={styles.signBar} />
                  <Image
                    source={{
                      uri:
                        "https://api.saijo-denki.com/img/club/upload/signature/" +
                        jobID +
                        ".png",
                    }}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode={"contain"}
                  />
                </View>
              </View>
            </View>
          </View>
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

export default ReportScreen;
