import React, { useState, useEffect } from "react";
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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from "../../components/font";
import { summaryForm } from "../../api/summary";
import styles from "../../assets/stylesheet/home/report";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ExpandableComponent = ({
  data,
  onPressFunction,
  jobType,
  setModalVisible,
  setImageUri,
  setModalTitle,
}) => {
  const outputFormat = (value, type, unit) => {
    switch (true) {
      case unit === "touch":
        return (
          <Text
            style={[styles.touch, { opacity: value === "false" ? 0.5 : 1 }]}
          >
            {"สัมผัส"}
          </Text>
        );
      case unit === "sound":
        return (
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.input_circle,
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
            </View>
            <View
              style={[
                styles.input_circle,
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
            </View>
          </View>
        );
      case unit === "boolean" && type === "radio":
        return (
          <View style={{ flexDirection: "row" }}>
            <View
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
            </View>
            <View
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
            </View>
          </View>
        );
      case unit === "speed":
        return (
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "1" ? "#b31117" : "transparent",
                  height: height * 0.0225,
                  width: height * 0.0225,
                  margin: height * 0.0025,
                },
              ]}
            >
              <Text
                style={[
                  styles.speed,
                  { color: value === "1" ? "#f2f2f2" : "#b31117" },
                ]}
              >
                1
              </Text>
            </View>
            <View
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "2" ? "#b31117" : "transparent",
                  height: height * 0.0225,
                  width: height * 0.0225,
                  margin: height * 0.0025,
                },
              ]}
            >
              <Text
                style={[
                  styles.speed,
                  { color: value === "2" ? "#f2f2f2" : "#b31117" },
                ]}
              >
                2
              </Text>
            </View>
            <View
              style={[
                styles.input_circle,
                {
                  backgroundColor: value === "3" ? "#b31117" : "transparent",
                  height: height * 0.0225,
                  width: height * 0.0225,
                  margin: height * 0.0025,
                },
              ]}
            >
              <Text
                style={[
                  styles.speed,
                  { color: value === "3" ? "#f2f2f2" : "#b31117" },
                ]}
              >
                3
              </Text>
            </View>
          </View>
        );
      case unit === "sound_error":
        return (
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.input_circle,
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
            </View>
            <View
              style={[
                styles.input_circle,
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
            </View>
          </View>
        );
      case unit === "fan_speed":
        return (
          <Text
            style={[styles.expanded_label, { paddingRight: 0 }]}
            numberOfLines={1}
          >
            {value}
          </Text>
        );
      default:
        return (
          <Text
            style={[styles.expanded_label, { paddingRight: 0 }]}
            numberOfLines={1}
          >
            {value + " " + unit}
          </Text>
        );
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
        {item.value.map((data, index) => (
          <View
            key={index}
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
                    borderBottomWidth: item.value.length - 1 === index ? 0 : 1,
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
                <Text style={styles.expanded_label}>{data.value}</Text>
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
                <Text style={styles.expanded_label}>
                  {jobType === "1" || jobType === "2"
                    ? data.title_en + " - " + data.sn
                    : data.title_en}
                </Text>
                <Pressable
                  onPress={() => {
                    setModalVisible(true);
                    setImageUri(
                      data.value.length
                        ? data.unit === "before_image"
                          ? "https://api.saijo-denki.com/img/club/upload/before/" +
                            data.value
                          : "https://api.saijo-denki.com/img/club/upload/after/" +
                            data.value
                        : null
                    );
                    setModalTitle(
                      jobType === "1" || jobType === "2"
                        ? data.title_en + " - " + data.sn
                        : data.title_en
                    );
                  }}
                >
                  <Image
                    source={
                      data.value.length
                        ? {
                            uri:
                              data.unit === "before_image"
                                ? "https://api.saijo-denki.com/img/club/upload/before/" +
                                  data.value
                                : "https://api.saijo-denki.com/img/club/upload/after/" +
                                  data.value,
                          }
                        : null
                    }
                    style={[
                      styles.report_image,
                      {
                        height: data.value.length ? height * 0.2 : 0,
                      },
                    ]}
                  />
                </Pressable>
              </View>
            ) : (
              <View style={styles.expanded_value_container}>
                <View style={styles.report_card_circle} />

                {outputFormat(data.value, data.input_type, data.unit)}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  ));
};

const ReportScreen = ({ navigation, route }) => {
  const [listData, setListData] = useState([]);
  const [jobID, setJobID] = useState(0);
  const [jobType, setJobType] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalSign, setModalSign] = useState(false);

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let job_id = route.params?.job_id ? route.params.job_id : 0;
          let res = await summaryForm(token, job_id);
          let report = res.data.data;

          var result = report.map((data) => ({
            ...data,
            body: data.body.map((item) => ({
              ...item,
              isExpanded: true,
            })),
          }));

          setListData(result);
          setJobType(route.params?.job_type ? route.params.job_type : 0);
          setJobID(route.params?.job_id ? route.params.job_id : 0);
        } catch (error) {
          console.log(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.report_sub_header}>
        ข้อกำหนดในการตรวจสอบ รอให้เครื่องทำงานอย่างน้อย 10 นาที
      </Text>
      <ScrollView
        style={{
          width: "100%",
          marginTop: height * 0.01,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: width, alignItems: "center" }}>
          {listData.map((item, index) => (
            <View key={index} style={styles.report_container}>
              <Text style={[styles.report_title, { marginTop: 0 }]}>
                {item.header_th}
              </Text>
              <ExpandableComponent
                data={item}
                onPressFunction={(val) => updateLayout(index, val)}
                jobType={jobType}
                setModalVisible={setModalVisible}
                setImageUri={setImageUri}
                setModalTitle={setModalTitle}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <Pressable
        style={styles.view_sign_button}
        onPress={() => setModalSign(true)}
      >
        <Text style={styles.button_text}>ดูลายเซ็น</Text>
      </Pressable>
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
                source={{ uri: imageUri }}
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
                <View style={styles.sign_bar} />
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
  );
};

export default ReportScreen;
