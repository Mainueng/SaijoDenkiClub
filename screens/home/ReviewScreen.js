import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  Dimensions,
  Modal,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/home/report";
import {
  assessmentForm,
  uploadAssessmentSign,
  saveAssessmentForm,
  sendInvoice,
} from "../../api/summary";
import { FontAwesome5 } from "@expo/vector-icons";
import { normalize } from "../../components/font";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import moment from "moment";

const { width, height } = Dimensions.get("window");

const ReviewScreen = ({ navigation, route }) => {
  const [listData, setListData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [modalSign, setModalSign] = useState(false);

  const ref = useRef();

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let job_id = route.params?.job_id ? route.params.job_id : 0;
          let res = await assessmentForm(token, job_id);

          setListData(res.data.data);
        } catch (error) {
          console.log(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const outputFormat = (index, key, type, value) => {
    switch (true) {
      case type === "date":
        return null;
      case type === "text":
        return (
          <View style={styles.assessment_note_container}>
            <TextInput
              style={[
                styles.from_input,
                { height: height * 0.1, marginBottom: height * 0.02 },
              ]}
              multiline={true}
              value={value}
              autoCapitalize="none"
              onChangeText={(val) => updateValue(index, key, val)}
            />
          </View>
        );
      case type === "boolean":
        return (
          <View style={styles.assessment_score_container}>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => updateValue(index, key, "true")}
            >
              <View
                style={[
                  styles.input_circle,
                  {
                    backgroundColor:
                      value === "true" ? "#b31117" : "transparent",
                  },
                ]}
              >
                <FontAwesome5
                  name="check"
                  color={value === "true" ? "#ffffff" : "#b31117"}
                  size={normalize(10) > 14 ? 14 : normalize(10)}
                />
              </View>
              <Text style={styles.assessment_score_desc}>
                {index === 2 ? "ใช้บริการ" : index === 3 ? "แนะนำ" : "พอใจ"}
              </Text>
            </Pressable>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => updateValue(index, key, "false")}
            >
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
              <Text style={styles.assessment_score_desc}>
                {index === 2
                  ? "ไม่ใช้บริการ"
                  : index === 3
                  ? "ไม่แนะนำ"
                  : "ไม่พอใจ"}
              </Text>
            </Pressable>
          </View>
        );
      default:
        return (
          <View style={styles.assessment_score_container}>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => updateValue(index, key, "1")}
            >
              <View
                style={[
                  styles.input_circle,
                  {
                    backgroundColor: value === "1" ? "#b31117" : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.assessment_score_text,
                    {
                      color: value === "1" ? "#ffffff" : "#b31117",
                    },
                  ]}
                >
                  1
                </Text>
              </View>
              <Text style={styles.assessment_score_desc}>ต้องปรับปรุง</Text>
            </Pressable>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => updateValue(index, key, "2")}
            >
              <View
                style={[
                  styles.input_circle,
                  {
                    backgroundColor: value === "2" ? "#b31117" : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.assessment_score_text,
                    {
                      color: value === "2" ? "#ffffff" : "#b31117",
                    },
                  ]}
                >
                  2
                </Text>
              </View>
              <Text style={styles.assessment_score_desc}>น้อย</Text>
            </Pressable>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => updateValue(index, key, "3")}
            >
              <View
                style={[
                  styles.input_circle,
                  {
                    backgroundColor: value === "3" ? "#b31117" : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.assessment_score_text,
                    {
                      color: value === "3" ? "#ffffff" : "#b31117",
                    },
                  ]}
                >
                  3
                </Text>
              </View>
              <Text style={styles.assessment_score_desc}>ปานกลาง</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => updateValue(index, key, "4")}
            >
              <View
                style={[
                  styles.input_circle,
                  {
                    backgroundColor: value === "4" ? "#b31117" : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.assessment_score_text,
                    {
                      color: value === "4" ? "#ffffff" : "#b31117",
                    },
                  ]}
                >
                  4
                </Text>
              </View>
              <Text style={styles.assessment_score_desc}>มาก</Text>
            </Pressable>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => updateValue(index, key, "5")}
            >
              <View
                style={[
                  styles.input_circle,
                  {
                    backgroundColor: value === "5" ? "#b31117" : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.assessment_score_text,
                    {
                      color: value === "5" ? "#ffffff" : "#b31117",
                    },
                  ]}
                >
                  5
                </Text>
              </View>
              <Text style={styles.assessment_score_desc}>มากที่สุด</Text>
            </Pressable>
          </View>
        );
    }
  };

  const updateValue = (index, key, value) => {
    let result = listData.map((item, i) => {
      item.body.map((data, k) => {
        if (i === index && k === key) {
          data.value = value;
        }

        return data;
      });

      return item;
    });

    setListData(result);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
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
        try {
          let token = await AsyncStorage.getItem("token");
          let job_id = route.params?.job_id ? route.params.job_id : 0;

          try {
            await uploadAssessmentSign(token, job_id, e.uri);
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.error);
  };

  const handleConfirm = async () => {
    ref.current.readSignature();

    let token = null;

    try {
      token = await AsyncStorage.getItem("token");
    } catch (error) {
      console.log(error);
    }

    let result = listData.map((item) => {
      item.body.map((data) => {
        delete data["error"];

        return data;
      });

      return item;
    });

    (async () => {
      let job_id = route.params?.job_id ? route.params.job_id : 0;

      try {
        await saveAssessmentForm(token, job_id, result);
        // await sendInvoice(token, job_id);

        setModalSign(false);

        navigation.navigate({
          name: "Home",
        });
      } catch (error) {
        console.log(error.response.data.message);
      }
    })();
  };

  const validate = async () => {
    let error = false;
    let result = listData.map((item, index) => {
      item.body.map((data) => {
        if (data.type === "date") {
          data.value = moment(date).format("YYYY-MM-DD HH:mm:ss");
        }

        if (!data.value.length && index !== listData.length - 1) {
          data.error = true;
          error = true;
        } else {
          data.error = false;
        }

        return data;
      });

      return item;
    });

    if (error) {
      setListData(result);
      Alert.alert("Warring!", "กรุณากรอกข้อมูลให้ครบ");
    } else {
      setModalSign(true);
    }
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
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={"position"}
        keyboardVerticalOffset={height * 0.1}
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <ScrollView
          style={{
            width: "100%",
            marginTop: height * 0.01,
          }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                width: width,
                alignItems: "center",
              }}
            >
              {listData.map((item, index) => (
                <View key={index} style={styles.report_container}>
                  <Text
                    style={[
                      styles.report_title,
                      {
                        marginTop: 0,
                      },
                    ]}
                  >
                    {item.header_th}
                  </Text>
                  {item.body.map((data, key) => (
                    <View style={styles.report_card} key={key}>
                      <View style={styles.report_card_header} />
                      <View
                        style={{
                          width: "100%",
                        }}
                      >
                        <Text
                          style={[
                            styles.report_label,
                            {
                              color: data.error ? "#b31117" : "#000000",
                            },
                          ]}
                        >
                          {data.title_th}
                        </Text>
                        {outputFormat(index, key, data.type, data.value)}
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </TouchableWithoutFeedback>
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
                validate();
              }}
            >
              <Text style={styles.button_text}>ยืนยัน</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    </SafeAreaView>
  );
};

export default ReviewScreen;
