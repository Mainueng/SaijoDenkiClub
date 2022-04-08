import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  Image,
  Modal,
  Linking,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "../assets/stylesheet/home/home";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { normalize } from "./font";

import { jobInfo, jobStatusLog, checkIn, acceptJob, nav } from "../api/jobs";
import { invoiceInfo } from "../api/summary";
import logo from "../assets/image/home/logo.png";

const JobInfoModal = ({ modalData, updateUpcoming, updateRecommend, nav }) => {
  const [jobInfoData, setJobInfoData] = useState({});
  const [statusLog, setStatusLog] = useState([]);
  const [locationStatus, setLocationStatus] = useState("");
  const [checkInStatus, setCheckInStatus] = useState(false);
  const [checkInModal, setCheckInModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [page, setPage] = useState(0);
  const [problemImageUri, setProblemImageUri] = useState(null);
  const [problemImageModal, setProblemImageModal] = useState(false);

  const { width } = Dimensions.get("window");

  const openJobInfoModal = async (job_id) => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await jobInfo(token, job_id);

        setJobInfoData(res.data.data[0]);
      } catch (error) {
        console.log(error);
      }

      try {
        let res = await jobStatusLog(token, job_id);

        setStatusLog(res.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openMap = () => {
    var scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    var url = scheme + `${"13.8484942"},${"100.5319401"}`;
    Linking.openURL(url);
  };

  const modalButton = (
    job_id,
    status_code,
    phoneNumber,
    job_status_en,
    job_status_th,
    job_type_code,
    review
  ) => {
    switch (true) {
      case status_code === 1 || status_code === 2:
        return (
          <View style={styles.modal_button_container}>
            <Pressable
              style={styles.checkin_button}
              onPress={() => {
                modalData.openModal = false;
                setJobInfoData({});
                setStatusLog([]);
                setCheckInStatus(false);
              }}
            >
              <Text style={styles.modal_button_text}>ปฏิเสธ</Text>
            </Pressable>
            <Pressable
              style={styles.call_button}
              onPress={() => acceptJobHandle(job_id)}
            >
              <Text style={styles.modal_button_text}>รับงาน</Text>
            </Pressable>
          </View>
        );
      case status_code === 3:
        return (
          <View style={styles.modal_button_container}>
            <Pressable
              style={styles.checkin_button}
              onPress={() => checkInHandle(job_id)}
            >
              <Text style={styles.modal_button_text}>เช็คอิน</Text>
            </Pressable>
            <Pressable
              style={styles.call_button}
              onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
            >
              <Text style={styles.modal_button_text}>โทร</Text>
            </Pressable>
          </View>
        );
      case status_code === 7 || status_code === 8 || status_code === 100:
        return (
          <View style={styles.modal_button_container}>
            <Pressable
              style={styles.checkin_button}
              onPress={() => checkInHandle(job_id)}
            >
              <Text style={styles.modal_button_text}>เช็คอิน</Text>
            </Pressable>
            <Pressable
              style={styles.call_button}
              onPress={() => summaryJobHandle(job_id, job_type_code)}
            >
              <Text style={styles.modal_button_text}>
                {status_code === 7 ? "ดำเนินการแก้ไขงาน" : "สรุปการทำงาน"}
              </Text>
            </Pressable>
          </View>
        );
      case status_code === 5 || status_code === 6:
        return (
          <View style={styles.modal_button_container}>
            <View style={styles.cancel_button}>
              <Text style={styles.modal_button_text}>
                {status_code === 5 ? "ยกเลิก" : "ไม่เคลื่อนไหว"}
              </Text>
            </View>
          </View>
        );
      case status_code === 10:
        return (
          <View style={styles.modal_button_container}>
            <Pressable
              style={styles.summary_button}
              onPress={() => invoiceHandle(job_id)}
            >
              <Text style={styles.modal_button_text}>เอกสารการชำระเงิน</Text>
            </Pressable>
          </View>
        );
      default:
        return (
          <View style={styles.modal_button_container}>
            {parseInt(review) ? (
              <Pressable
                style={styles.summary_button}
                onPress={() => reportJobHandle(job_id, job_type_code)}
              >
                <Text style={styles.modal_button_text}>
                  {job_status_th} (แสดงรายงาน)
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.summary_button}
                onPress={() => reviewJobHandle(job_id)}
              >
                <Text style={styles.modal_button_text}>
                  แบบประเมินความพึงพอใจ
                </Text>
              </Pressable>
            )}
          </View>
        );
    }
  };

  const checkInHandle = async (job_id) => {
    if (locationStatus === "granted") {
      setCheckInModal(true);
      let location = await Location.getCurrentPositionAsync({});
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          await checkIn(
            token,
            job_id,
            location.coords.latitude,
            location.coords.longitude
          );

          setCheckInStatus(true);
          setCheckInModal(false);

          Alert.alert("Success", "Check-in success.");
        } catch (error) {
          setCheckInModal(false);
          Alert.alert("Success", "Check-in failed!");
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        setCheckInModal(false);
      }
    } else {
      Alert.alert(
        "Check-in failed!",
        "Permission to access location was denied."
      );
    }
  };

  const acceptJobHandle = async (job_id) => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        await acceptJob(token, job_id);

        modalData.openModal = false;
        setJobInfoData({});
        setStatusLog([]);

        if (updateRecommend) {
          updateRecommend();
        }

        if (updateUpcoming) {
          updateUpcoming();
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const summaryJobHandle = async (job_id, job_type_code) => {
    if (checkInStatus) {
      modalData.openModal = false;
      setJobInfoData({});
      setStatusLog([]);

      nav.navigate({
        name: "Summary",
        params: {
          job_id: job_id,
          job_type: job_type_code,
        },
      });
    } else {
      Alert.alert("Warring!", "Please check-in.");
    }
  };

  const reportJobHandle = async (job_id, job_type_code) => {
    modalData.openModal = false;
    setJobInfoData({});
    setStatusLog([]);

    nav.navigate({
      name: "Report",
      params: {
        job_id: job_id,
        job_type: job_type_code,
      },
    });
  };

  const reviewJobHandle = async (job_id) => {
    modalData.openModal = false;
    setJobInfoData({});
    setStatusLog([]);

    nav.navigate({
      name: "Review",
      params: {
        job_id: job_id,
      },
    });
  };

  const invoiceHandle = async (job_id) => {
    modalData.openModal = false;
    setJobInfoData({});
    setStatusLog([]);
    setInvoiceModal(true);

    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await invoiceInfo(token, job_id);

        setInvoiceData(res.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const numberFormat = (val) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const change = ({ nativeEvent }) => {
    let slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );

    if (page !== slide) {
      setPage(slide);
    }
  };

  const problemImage = (val) => {
    if (val) {
      return val.split(",");
    } else {
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Warring!", "Permission to access location was denied.");

        return;
      } else {
        setLocationStatus("granted");
      }
    })();
  }, []);

  useEffect(() => {
    if (modalData.jobID) {
      openJobInfoModal(modalData.jobID);
    }
  }, [modalData]);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalData.openModal ? modalData.openModal : false}
      >
        <Modal animationType="fade" transparent={true} visible={checkInModal}>
          <View style={styles.modal_background}>
            <ActivityIndicator size="large" />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={problemImageModal}
        >
          <View style={styles.modal_background}>
            <View
              style={[
                styles.modal_container,
                {
                  backgroundColor: "transparent",
                  height: "auto",
                },
              ]}
            >
              <View style={styles.modal_header}>
                <Text style={styles.modal_header_text}>รูปอาการเสีย</Text>
                <Pressable
                  style={styles.close_problem_btn}
                  onPress={() => {
                    setProblemImageModal(false);
                    setProblemImageUri(null);
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
                    uri: problemImageUri,
                  }}
                  style={styles.modal_problem_image}
                  resizeMode={"cover"}
                />
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <View style={styles.modal_header_container}>
              <Image
                source={
                  jobInfoData.profile_picture
                    ? {
                        uri:
                          "https://api.saijo-denki.com/img/core/upload/profile_img/" +
                          jobInfoData.profile_picture +
                          "?" +
                          new Date(),
                      }
                    : logo
                }
                resizeMode={"cover"}
                style={styles.modal_profile_image}
              />
              <View style={styles.modal_name_container}>
                <View style={styles.name_container}>
                  <Text style={styles.modal_name}>
                    {jobInfoData.name + " " + jobInfoData.lastname}
                  </Text>
                </View>
                <View style={styles.name_container}>
                  <Text style={styles.modal_job_id}>
                    Job ID: {jobInfoData.job_id}
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.close_modal_btn}
                onPress={() => {
                  modalData.openModal = false;
                  setJobInfoData({});
                  setStatusLog([]);
                  setCheckInStatus(false);
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={normalize(18) > 28 ? 28 : normalize(18)}
                  color={"#ffffff"}
                />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScroll={change}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: width * 0.9,
                  }}
                >
                  <View style={styles.modal_body_container}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{
                        flex: 1,
                      }}
                      bounces={true}
                    >
                      <View
                        style={[
                          styles.modal_body_info_container,
                          { marginBottom: "3%" },
                        ]}
                      >
                        <View style={{ opacity: "0" }}>
                          <MaterialCommunityIcons
                            name="shield-check"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                        </View>
                        <Text style={styles.modal_info_header}>
                          งาน: {jobInfoData.job_type_th} -{" "}
                          {jobInfoData.job_status_th}
                        </Text>
                      </View>
                      <View style={{ marginBottom: "3%" }}>
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="calendar-clock"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>
                            วัน-เวลานัดหมาย
                          </Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <Text style={styles.modal_info_description}>
                            {jobInfoData.appointment_date_th} -{" "}
                            {jobInfoData.appointment_time}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginBottom: "3%" }}>
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="clipboard-list-outline"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>
                            {jobInfoData.job_type_code === "1" ||
                            jobInfoData.job_type_code === "2"
                              ? "หมายเลขประจำเครื่อง"
                              : "รายการติดตั้ง"}
                          </Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            {jobInfoData.job_type_code === "1" ||
                            jobInfoData.job_type_code === "2" ? (
                              <Text style={styles.modal_info_description}>
                                {jobInfoData.serial}
                              </Text>
                            ) : jobInfoData.install_list ? (
                              jobInfoData.install_list.map((item, index) => (
                                <View
                                  style={
                                    styles.modal_info_description_container
                                  }
                                  key={index}
                                >
                                  <Text style={styles.modal_info_description}>
                                    {item.item}
                                  </Text>
                                </View>
                              ))
                            ) : null}
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: "3%",
                          display:
                            jobInfoData.job_type_code === "1" ||
                            jobInfoData.job_type_code === "2"
                              ? "none"
                              : "flex",
                        }}
                      >
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="hammer-wrench"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>อุปกรณ์</Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            {typeof jobInfoData.symptom === "object"
                              ? jobInfoData.symptom.map((item, index) => (
                                  <View
                                    style={
                                      styles.modal_info_description_container
                                    }
                                    key={index}
                                  >
                                    <Text style={styles.modal_info_description}>
                                      {item.code}
                                    </Text>
                                    <Text style={styles.modal_info_description}>
                                      {item.qt} {item.unit}
                                    </Text>
                                  </View>
                                ))
                              : null}
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: "3%",
                          display:
                            jobInfoData.job_type_code === "2" ? "none" : "flex",
                        }}
                      >
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="cash-multiple"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>ค่าบริการ</Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View
                              style={styles.modal_info_description_container}
                            >
                              <Text style={styles.modal_info_description}>
                                {jobInfoData.job_type_code === "1"
                                  ? numberFormat(
                                      parseFloat(
                                        jobInfoData.service_cost
                                      ).toFixed(2)
                                    )
                                  : numberFormat(
                                      parseFloat(jobInfoData.cost).toFixed(2)
                                    )}{" "}
                                บาท
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: "3%",
                          display:
                            jobInfoData.job_type_code === "1" ||
                            jobInfoData.job_type_code === "2"
                              ? "none"
                              : "flex",
                        }}
                      >
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="note-text-outline"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>หมายเหตุ</Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View
                              style={styles.modal_info_description_container}
                            >
                              <Text style={styles.modal_info_description}>
                                {jobInfoData.comment
                                  ? jobInfoData.comment
                                  : "-"}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: "3%",
                          display:
                            jobInfoData.job_type_code === "2" ? "flex" : "none",
                        }}
                      >
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="hammer-wrench"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>อาการเสีย</Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View
                              style={styles.modal_info_description_container}
                            >
                              <Text style={styles.modal_info_description}>
                                {typeof jobInfoData.symptom === "string"
                                  ? jobInfoData.symptom
                                  : null}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          marginBottom: "3%",
                          display:
                            jobInfoData.job_type_code === "2" ? "flex" : "none",
                        }}
                      >
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="image-multiple-outline"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>
                            รูปอาการเสีย
                          </Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={styles.modal_info_image_container}>
                              {problemImage(jobInfoData.problem_img).map(
                                (item, index) => (
                                  <Pressable
                                    key={index}
                                    style={{
                                      marginRight: "2%",
                                      marginTop: "2%",
                                    }}
                                    onPress={() => {
                                      setProblemImageUri(
                                        "https://api.saijo-denki.com/img/club/upload/problem_img/" +
                                          item
                                      );
                                      setProblemImageModal(true);
                                    }}
                                  >
                                    <Image
                                      source={{
                                        uri:
                                          "https://api.saijo-denki.com/img/club/upload/problem_img/" +
                                          item,
                                      }}
                                      resizeMode={"cover"}
                                      style={styles.problem_image_thumb}
                                    />
                                  </Pressable>
                                )
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ marginBottom: "3%" }}>
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="domain"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>ที่อยู่</Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View
                              style={styles.modal_info_description_container}
                            >
                              <Text style={styles.modal_info_description}>
                                {jobInfoData.address +
                                  " " +
                                  jobInfoData.district +
                                  " " +
                                  jobInfoData.province +
                                  " " +
                                  jobInfoData.postal_code}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ marginBottom: "3%" }}>
                        <View style={styles.modal_body_info_container}>
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={normalize(14) > 24 ? 24 : normalize(14)}
                          />
                          <Text style={styles.modal_info_title}>ระยะห่าง</Text>
                        </View>
                        <View style={styles.modal_body_info_container}>
                          <View style={{ opacity: "0" }}>
                            <MaterialCommunityIcons
                              name="shield-check"
                              size={normalize(14) > 24 ? 24 : normalize(14)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View
                              style={styles.modal_info_description_container}
                            >
                              <Text style={styles.modal_info_description}>
                                {jobInfoData.radius}{" "}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.map_container}>
                        <MapView
                          style={styles.map}
                          region={{
                            latitude: jobInfoData.latitude
                              ? parseFloat(jobInfoData.latitude)
                              : 0,
                            longitude: jobInfoData.longitude
                              ? parseFloat(jobInfoData.longitude)
                              : 0,
                            latitudeDelta: 0.0922 / 12,
                            longitudeDelta: 0.0421 / 12,
                          }}
                          scrollEnabled={false}
                          zoomEnabled={false}
                          onPress={() => openMap()}
                        >
                          <Marker
                            coordinate={{
                              latitude: jobInfoData.latitude
                                ? parseFloat(jobInfoData.latitude)
                                : 0,
                              longitude: jobInfoData.longitude
                                ? parseFloat(jobInfoData.longitude)
                                : 0,
                              latitudeDelta: 0.0922 / 12,
                              longitudeDelta: 0.0421 / 12,
                            }}
                          ></Marker>
                        </MapView>
                      </View>
                    </ScrollView>
                  </View>
                </View>
                <View
                  style={{
                    height: "100%",
                    width: width * 0.9,
                  }}
                >
                  <View style={styles.modal_body_container}>
                    <View style={styles.modal_log_bar}></View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{
                        flex: 1,
                      }}
                      bounces={true}
                    >
                      <View
                        style={[
                          styles.modal_body_info_container,
                          { marginBottom: "3%" },
                        ]}
                      >
                        <View style={{ opacity: "0" }}>
                          <MaterialCommunityIcons
                            name="checkbox-blank-circle"
                            size={normalize(10) > 20 ? 20 : normalize(10)}
                          />
                        </View>
                        <Text style={styles.modal_info_header}>สถานะ</Text>
                      </View>
                      {statusLog.map((item, index) => (
                        <View style={{ marginBottom: "3%" }} key={index}>
                          <View style={styles.modal_body_info_container}>
                            <MaterialCommunityIcons
                              name="checkbox-blank-circle"
                              size={normalize(10) > 20 ? 20 : normalize(10)}
                              color={"#b31117"}
                            />
                            <Text style={styles.modal_info_title}>
                              {item.name_th}
                            </Text>
                          </View>
                          <View style={styles.modal_body_info_container}>
                            <View style={{ opacity: "0" }}>
                              <MaterialCommunityIcons
                                name="checkbox-blank-circle"
                                size={normalize(10) > 20 ? 20 : normalize(10)}
                              />
                            </View>
                            <Text style={styles.modal_info_description}>
                              {item.update_datetime_th}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.paging_container}>
              <View
                style={[
                  styles.page_bullet,
                  page === 0 ? styles.active_bullet : null,
                ]}
              />
              <View
                style={[
                  styles.page_bullet,
                  page === 1 ? styles.active_bullet : null,
                ]}
              />
            </View>
            {modalButton(
              parseInt(jobInfoData.job_id),
              parseInt(jobInfoData.status_code),
              jobInfoData.telephone,
              jobInfoData.job_status_en,
              jobInfoData.job_status_th,
              jobInfoData.job_type_code,
              jobInfoData.review
            )}
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={invoiceModal}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <View style={styles.modal_header_container}>
              <Image
                source={logo}
                resizeMode={"cover"}
                style={styles.modal_invoice_image}
              />
              <View style={styles.modal_name_container}>
                <View style={styles.name_container}>
                  <Text style={styles.modal_name}>
                    บริษัท ซัยโจ เด็นกิ อินเตอร์เนชั่นแนล จำกัด
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.close_modal_btn}
                onPress={() => {
                  setInvoiceModal(false);
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={normalize(18) > 28 ? 28 : normalize(18)}
                  color={"#ffffff"}
                />
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: width * 0.9,
                  borderBottomColor: "rgba(0,0,0,0.15)",
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={[styles.modal_info_container, { marginTop: "5%" }]}
                >
                  <Text style={styles.modal_info_title}>เอกสารเลขที่</Text>
                  <Text style={styles.modal_info_description}>
                    {invoiceData.invNo}
                  </Text>
                </View>
                <View style={styles.modal_info_container}>
                  <Text style={styles.modal_info_title}>หมายเลขงาน</Text>
                  <Text style={styles.modal_info_description}>
                    {invoiceData.jobNo}
                  </Text>
                </View>
                <View style={styles.modal_info_container}>
                  <Text style={styles.modal_info_title}>
                    ช่องทางการชำระเงิน
                  </Text>
                  <Text style={styles.modal_info_description}>
                    {invoiceData.paymentChannel}
                  </Text>
                </View>
                <View
                  style={[styles.modal_info_container, { marginBottom: "2%" }]}
                >
                  <Text style={styles.modal_info_title}>จำนวนเงิน</Text>
                  <Text style={styles.modal_info_description}>
                    {numberFormat(parseFloat(invoiceData.total).toFixed(2))} บาท
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.slip_image_container}>
              <Image
                source={{ uri: invoiceData.slip + "?" + new Date() }}
                resizeMode={"contain"}
                style={styles.slip_image}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default JobInfoModal;
