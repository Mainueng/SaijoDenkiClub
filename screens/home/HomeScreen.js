import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  RefreshControl,
  Modal,
  Linking,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/home/home";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { normalize } from "../../components/font";
import moment from "moment";
import TextTicker from "react-native-text-ticker";
import MapView, { Marker } from "react-native-maps";
import jwt_decode from "jwt-decode";

import { user_info } from "../../api/user";
import { upcoming, recommend, history, jobInfo } from "../../api/jobs";

const { width } = Dimensions.get("window");

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

let demoUpcoming = [
  {
    job_id: "428",
    appointment_date: "23-03-2022",
    appointment_date_en: "6 Apr. 2022",
    appointment_date_th: "6 เม.ษ. 2565",
    appointment_time: "10:00",
    status_code: "13",
    job_type_en: "Project Repaire",
    job_type_th: "งานแจ้งซ่อมโครงการ",
    job_type_code: "6",
    job_status_en: "Send Billing",
    job_status_th: "ส่งใบวางบิล",
    name: "คลินิกกองเรือยุทธการ",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
  {
    job_id: "255",
    appointment_date: "06-04-2022",
    appointment_date_en: "6 Apr. 2022",
    appointment_date_th: "6 เม.ษ. 2565",
    appointment_time: "12:37",
    status_code: "13",
    job_type_en: "Install Sale Project",
    job_type_th: "งานติดตั้งงานโครงการ",
    job_type_code: "5",
    job_status_en: "Send Billing",
    job_status_th: "ส่งใบวางบิล",
    name: "โรงพยาบาลพิชัย",
    lastname: "-",
    radius: "0.1 km",
    latitude: "13.846099656469818",
    longitude: "100.53295320502336",
  },
  {
    job_id: "425",
    appointment_date: "03-03-2022",
    appointment_date_en: "3 Mar. 2022",
    appointment_date_th: "3 มี.ค. 2565",
    appointment_time: "18:16",
    status_code: "15",
    job_type_en: "Project Repaire",
    job_type_th: "งานแจ้งซ่อมโครงการ",
    job_type_code: "6",
    job_status_en: "Apporved",
    job_status_th: "อนุมัติชำระเงิน",
    name: "คลินิกกองเรือยุทธการ",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.846375781067026",
    longitude: "100.53301675337295",
  },
  {
    job_id: "427",
    appointment_date: "03-03-2022",
    appointment_date_en: "3 Mar. 2022",
    appointment_date_th: "3 มี.ค. 2565",
    appointment_time: "14:40",
    status_code: "6",
    job_type_en: "Project Repaire",
    job_type_th: "งานแจ้งซ่อมโครงการ",
    job_type_code: "6",
    job_status_en: "inactive",
    job_status_th: "ไม่เคลื่อนไหว",
    name: "โรงพยาบาลสตูล",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
  {
    job_id: "366",
    appointment_date: "02-03-2022",
    appointment_date_en: "2 Mar. 2022",
    appointment_date_th: "2 มี.ค. 2565",
    appointment_time: "16:32",
    status_code: "6",
    job_type_en: "Project Repaire",
    job_type_th: "งานแจ้งซ่อมโครงการ",
    job_type_code: "6",
    job_status_en: "inactive",
    job_status_th: "ไม่เคลื่อนไหว",
    name: "โรงพยาบาลราชวิถี",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
  {
    job_id: "365",
    appointment_date: "07-02-2022",
    appointment_date_en: "7 Feb. 2022",
    appointment_date_th: "7 ก.พ. 2565",
    appointment_time: "17:19",
    status_code: "10",
    job_type_en: "Install Sale Project",
    job_type_th: "งานติดตั้งงานโครงการ",
    job_type_code: "5",
    job_status_en: "Payment Successful",
    job_status_th: "ชำระเงินสำเร็จ",
    name: "โรงพยาบาลพระนครศรีอยุธยา",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
  {
    job_id: "364",
    appointment_date: "07-02-2022",
    appointment_date_en: "7 Feb. 2022",
    appointment_date_th: "7 ก.พ. 2565",
    appointment_time: "17:12",
    status_code: "10",
    job_type_en: "Install Sale Project",
    job_type_th: "งานติดตั้งงานโครงการ",
    job_type_code: "5",
    job_status_en: "Payment Successful",
    job_status_th: "ชำระเงินสำเร็จ",
    name: "โรงพยาบาลพญาเม็งราย",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
  {
    job_id: "252",
    appointment_date: "02-02-2022",
    appointment_date_en: "2 Feb. 2022",
    appointment_date_th: "2 ก.พ. 2565",
    appointment_time: "12:00",
    status_code: "6",
    job_type_en: "Repair",
    job_type_th: "ซ่อมเครื่องปรับอากาศ",
    job_type_code: "2",
    job_status_en: "inactive",
    job_status_th: "ไม่เคลื่อนไหว",
    name: "ภณัต",
    lastname: "แช่มสิงห์",
    radius: "0.1 km",
    latitude: "13.846099656469818",
    longitude: "100.53295320502336",
  },
  {
    job_id: "70",
    appointment_date: "12-01-2022",
    appointment_date_en: "12 Jan. 2022",
    appointment_date_th: "12 ม.ค. 2565",
    appointment_time: "18:16",
    status_code: "6",
    job_type_en: "Repair",
    job_type_th: "ซ่อมเครื่องปรับอากาศ",
    job_type_code: "2",
    job_status_en: "inactive",
    job_status_th: "ไม่เคลื่อนไหว",
    name: "Roj",
    lastname: "-",
    radius: "2.3 km",
    latitude: "13.86638908474697",
    longitude: "100.53389047894552",
  },
];

let demoRecommend = [
  {
    job_id: "428",
    appointment_date: "31-03-2022",
    appointment_date_en: "31 Mar. 2022",
    appointment_date_th: "31 มี.ค. 2565",
    appointment_time: "08:58",
    status_code: "1",
    job_type_en: "Project Repaire",
    job_type_th: "งานแจ้งซ่อมโครงการ",
    job_type_code: "6",
    job_status_en: "created",
    job_status_th: "รอรับงาน",
    name: "คลินิกกองเรือยุทธการ",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
  {
    job_id: "429",
    appointment_date: "01-04-2022",
    appointment_date_en: "04 Apr. 2022",
    appointment_date_th: "04 เม.ษ. 2565",
    appointment_time: "08:58",
    status_code: "1",
    job_type_en: "Project Repaire",
    job_type_th: "งานแจ้งซ่อมโครงการ",
    job_type_code: "6",
    job_status_en: "created",
    job_status_th: "รอรับงาน",
    name: "คลินิกกองเรือยุทธการ",
    lastname: "",
    radius: "0.1 km",
    latitude: "13.8463263",
    longitude: "100.5330248",
  },
];

const HomeScreen = () => {
  const [tab, setTab] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingList, setUpcomingList] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [historyList, setHistoryList] = useState(demoUpcoming);
  const [jobInterval, setJobInterval] = useState(0);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [userID, setUserID] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [jobInfoData, setJobInfoData] = useState({});

  const onRefreshUpcoming = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(async () => {
      clearInterval(jobInterval);
      getUpcomingList();
      getRecommendList();
      setRefreshing(false);
    });
  }, []);

  const onRefreshHistory = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(async () => {
      setUpcomingList(demoUpcoming);
      setRefreshing(false);
    });
  }, []);

  const getUpcomingList = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await upcoming(token);

        countDown(res.data.data);

        let data = setInterval(() => {
          countDown(res.data.data);
        }, 60000);

        setJobInterval(data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommendList = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await recommend(token);
        setRecommendList(res.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const countDown = (upcomingData) => {
    let data = upcomingData.map((item) => {
      let date_spilt = item.appointment_date.split("-");

      let appointment = moment(
        date_spilt[2] +
          "-" +
          date_spilt[1] +
          "-" +
          date_spilt[0] +
          " " +
          item.appointment_time
      ).format("x");

      let now = moment().format("x");

      let countdown = appointment - now;

      let second = 1000;
      let minute = second * 60;
      let hour = minute * 60;
      let day = hour * 24;

      if (countdown >= 0) {
        let days = Math.floor(countdown / day);
        let hours = Math.floor((countdown % day) / hour);
        let mins = Math.floor((countdown % hour) / minute);

        if (days) {
          item.countdown = days + " Day(s)";
        } else if (hours) {
          item.countdown = hours + " Hour(s) " + mins + " Min(s)";
        } else {
          item.countdown = mins + " Min(s)";
        }
      } else {
        item.countdown = "Now";
      }

      return item;
    });

    setUpcomingList(data);
  };

  const jobInfoModal = async (job_id) => {
    setModalVisible(true);

    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await jobInfo(token, job_id);

        setJobInfoData(res.data.data[0]);
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

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let res = await user_info(token);
          let decode = jwt_decode(token);

          setUserID(decode.id);
          setName(res.data.data[0].name);
          setLastname(res.data.data[0].lastname);
          setProfileImage(res.data.data[0].profile_img);
          setRating(res.data.data[0].rating);
          setRatingCount(res.data.data[0].ratingCount);
        } catch (error) {
          console.log(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();

    getUpcomingList();
    getRecommendList();

    return () => {
      clearInterval(jobInterval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header_container}>
        <Pressable style={styles.profile_container}>
          <Image
            source={{
              uri:
                "https://api.saijo-denki.com/img/club/upload/profile_img/" +
                profileImage +
                "?" +
                new Date(),
            }}
            resizeMode={"cover"}
            style={styles.profile_image}
          />
        </Pressable>
        <View style={styles.header_right_container}>
          <View style={styles.name_container}>
            <MaterialCommunityIcons
              name="shield-check"
              color="#b31117"
              size={normalize(18) > 28 ? 28 : normalize(18)}
            />
            <Text style={styles.name}>
              {name} {lastname} ({userID})
            </Text>
          </View>
          <View style={styles.name_container}>
            <MaterialCommunityIcons
              name="star"
              color="#fbb03b"
              size={normalize(18) > 28 ? 28 : normalize(18)}
            />
            <Text style={styles.name}>
              {parseFloat(rating).toFixed(1)} ({ratingCount} points)
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.tab_container}>
        <Pressable style={styles.tab_header} onPress={() => setTab(1)}>
          <Text
            style={[
              styles.tab_title,
              tab === 1 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            Upcoming
          </Text>
          <View
            style={[styles.tab_bar, tab === 1 ? styles.tab_bar_active : null]}
          ></View>
        </Pressable>
        <Pressable style={styles.tab_header} onPress={() => setTab(2)}>
          <Text
            style={[
              styles.tab_title,
              tab === 2 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            History
          </Text>
          <View
            style={[
              styles.tab_bar,
              tab === 2 ? styles.tab_bar_active : styles.tab_inactive,
            ]}
          ></View>
        </Pressable>
        <Pressable style={styles.tab_header} onPress={() => setTab(3)}>
          <Text
            style={[
              styles.tab_title,
              tab === 3 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            Summary
          </Text>
          <View
            style={[styles.tab_bar, tab === 3 ? styles.tab_bar_active : null]}
          ></View>
        </Pressable>
      </View>
      <View
        style={{
          width: "100%",
          transform: [{ scale: tab === 1 ? 1 : 0 }],
          flex: tab === 1 ? 1 : 0,
          backgroundColor: "#e6e6e6",
        }}
      >
        <View style={{ flex: 1.75 }}>
          <ScrollView
            style={{
              width: "100%",
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshUpcoming}
              />
            }
          >
            <View style={{ width: "100%", alignItems: "center" }}>
              {upcomingList.length
                ? upcomingList.map((item, index) => (
                    <Pressable
                      style={styles.job_card_container}
                      key={index}
                      onPress={() => jobInfoModal(item.job_id)}
                    >
                      <Image
                        source={{
                          uri: "https://api.saijo-denki.com/img/core/upload/profile_img/user.png",
                        }}
                        resizeMode={"cover"}
                        style={styles.job_type_image}
                      />
                      <View style={styles.job_card_description}>
                        <TextTicker
                          style={styles.job_card_description_header}
                          duration={9000}
                          loop
                          bounce
                        >
                          {item.name + " " + item.lastname}
                        </TextTicker>
                        <View styles={styles.job_appointment_container}>
                          <Text style={styles.job_card_description_text}>
                            {item.appointment_date_th +
                              " - " +
                              item.appointment_time}
                          </Text>
                        </View>
                        <View style={styles.job_card_status_container}>
                          <Text style={styles.job_card_description_text}>
                            Job ID: {item.job_id}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={[
                                styles.job_card_description_text,
                                {
                                  display:
                                    typeof item.countdown !== "undefined"
                                      ? item.countdown === "Now"
                                        ? "none"
                                        : "flex"
                                      : "none",
                                },
                              ]}
                            >
                              Time left:{" "}
                            </Text>
                            <Text style={styles.job_card_status}>
                              {item.countdown ? item.countdown : ""}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))
                : null}
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 1, minHeight: 70 }}>
          <View style={styles.recommend_header_container}>
            <Text style={styles.recommend_header}>Recommend</Text>
            <Pressable>
              <Text style={styles.recommend_header}>Show All</Text>
            </Pressable>
          </View>
          {recommendList.length ? (
            <View style={{ marginHorizontal: "5%", marginTop: "2.5%" }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendList.map((item, index) => (
                  <Pressable style={styles.recommend_card} key={index}>
                    <Image
                      // source={{ uri: profileImage + "?" + new Date() }}
                      source={{
                        uri: "https://api.saijo-denki.com/img/core/upload/profile_img/user.png",
                      }}
                      resizeMode={"cover"}
                      style={styles.recommend_image}
                    />
                    <TextTicker
                      style={styles.recommend_card_description_header}
                      duration={9000}
                      loop
                      bounce
                    >
                      {item.name + " " + item.lastname}
                    </TextTicker>
                    <View style={styles.recommend_card_description}>
                      <MaterialCommunityIcons
                        name="calendar-clock"
                        color="rgba(0,0,0,0.3)"
                        size={normalize(14) > 14 ? 14 : normalize(14)}
                      />
                      <Text style={styles.recommend_card_description_text}>
                        {item.appointment_date_th}
                      </Text>
                    </View>
                    <View style={styles.recommend_card_description}>
                      <MaterialCommunityIcons
                        name="clock"
                        color="rgba(0,0,0,0.3)"
                        size={normalize(14) > 14 ? 14 : normalize(14)}
                      />
                      <Text style={styles.recommend_card_description_text}>
                        {item.appointment_time}
                      </Text>
                    </View>
                    <View style={styles.recommend_card_description}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        color="rgba(0,0,0,0.3)"
                        size={normalize(14) > 14 ? 14 : normalize(14)}
                      />
                      <Text style={styles.recommend_card_description_text}>
                        {item.radius}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          transform: [{ scale: tab === 2 ? 1 : 0 }],
          flex: tab === 2 ? 1 : 0,
          backgroundColor: "#e6e6e6",
        }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{
              width: "100%",
              marginBottom: "2.5%",
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshHistory}
              />
            }
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              {historyList.length
                ? historyList.map((item, index) => (
                    <Pressable style={styles.job_card_container} key={index}>
                      <Image
                        source={{
                          uri: "https://api.saijo-denki.com/img/core/upload/profile_img/user.png",
                        }}
                        resizeMode={"cover"}
                        style={styles.job_type_image}
                      />
                      <View style={styles.job_card_description}>
                        <TextTicker
                          style={styles.job_card_description_header}
                          duration={9000}
                          loop
                          bounce
                        >
                          {item.name + " " + item.lastname}
                        </TextTicker>
                        <View styles={styles.job_appointment_container}>
                          <Text style={styles.job_card_description_text}>
                            {item.appointment_date_th +
                              " - " +
                              item.appointment_time}
                          </Text>
                        </View>
                        <View style={styles.job_card_status_container}>
                          <Text style={styles.job_card_description_text}>
                            Job ID: {item.job_id}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.job_card_status}>
                              {item.job_status_en}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))
                : null}
            </View>
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          transform: [{ scale: tab === 3 ? 1 : 0 }],
          flex: tab === 3 ? 1 : 0,
          backgroundColor: "#e6e6e6",
        }}
      ></View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modal_background}>
          <View style={styles.modal_container}>
            <View style={styles.modal_header_container}>
              <Image
                source={{
                  uri: jobInfoData.profile_picture
                    ? "https://api.saijo-denki.com/img/core/upload/profile_img/" +
                      jobInfoData.profile_picture +
                      "?" +
                      new Date()
                    : "https://api.saijo-denki.com/img/core/upload/profile_img/user.png",
                }}
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
                onPress={() => setModalVisible(false)}
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
                            รายการติดตั้ง
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
                            {jobInfoData.install_list
                              ? jobInfoData.install_list.map((item, index) => (
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
                              : null}
                          </View>
                        </View>
                      </View>
                      <View style={{ marginBottom: "3%" }}>
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
                            {jobInfoData.symptom
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
                      <View style={{ marginBottom: "3%" }}>
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
                                {jobInfoData.cost} บาท
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ marginBottom: "3%" }}>
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
                    <Pressable
                      style={{
                        backgroundColor: "green",
                        height: 40,
                        width: "100%",
                        marginTop: "2%",
                      }}
                    ></Pressable>
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
                      {Array.apply(null, Array(10)).map((item, index) => (
                        <View style={{ marginBottom: "3%" }} key={index}>
                          <View style={styles.modal_body_info_container}>
                            <MaterialCommunityIcons
                              name="checkbox-blank-circle"
                              size={normalize(10) > 20 ? 20 : normalize(10)}
                              color={"#b31117"}
                            />
                            <Text style={styles.modal_info_title}>
                              รับงานแล้ว
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
                              4 มี.ค. 2556 - 14:00
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
