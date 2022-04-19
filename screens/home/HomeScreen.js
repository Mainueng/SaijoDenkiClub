import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/home/home";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { normalize } from "../../components/font";
import moment from "moment";
import TextTicker from "react-native-text-ticker";
import jwt_decode from "jwt-decode";

import { user_info } from "../../api/user";
import {
  upcoming,
  recommend,
  history,
  summary,
  summaryDetail,
} from "../../api/jobs";
import { invoices } from "../../api/summary";
import { notifications } from "../../api/notification";
import JobInfoModal from "../../components/job_info_modal";
import CleanIcon from "../../assets/image/home/clean_icon.png";
import RepairIcon from "../../assets/image/home/repair_icon.png";
import InstallIcon from "../../assets/image/home/install_icon.png";
import { TabContext } from "../../components/tab_context";
import * as Notifications from "expo-notifications";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const HomeScreen = ({ navigation }) => {
  const [tab, setTab] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingList, setUpcomingList] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [summaryList, setSummaryList] = useState([]);
  const [summaryDetailList, setSummaryDetailList] = useState([]);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [feeTotal, setFeeTotal] = useState(0);
  const [jobInterval, setJobInterval] = useState(0);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [userID, setUserID] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [active, setActive] = useState("0");
  const [invoiceList, setInvoiceList] = useState([]);

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
      getHistoryList();
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
        setUpcomingList([]);
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
        setRecommendList([]);
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryList = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await history(token);
        setHistoryList(res.data.data);
      } catch (error) {
        setHistoryList([]);
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
          item.countdown = days + " วัน";
        } else if (hours) {
          item.countdown = hours + " ชม. " + mins + " นาที";
        } else {
          item.countdown = mins + " นาที";
        }
      } else {
        item.countdown = "ถึงเวลานัด";
      }

      return item;
    });

    setUpcomingList(data);
  };

  const getSummaryList = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      let result = [];
      try {
        let res = await summary(token);
        setSummaryList(res.data.data);
        result = res.data.data;
      } catch (error) {
        setSummaryList([]);
        console.log(error.response.data.message);
      }

      try {
        let res = await summaryDetail(token);
        let fee_total = 0;
        let service_total = 0;

        setSummaryDetailList(res.data.data);

        let summaryData = result.map((item) => {
          res.data.data.map((data) => {
            if (item.status_code === data.status_code) {
              item.serv_cost = data.serv_cost;

              service_total = service_total + 1;

              if (data.serv_cost) {
                fee_total = fee_total + parseFloat(data.serv_cost);
              }
            }

            return data;
          });

          return item;
        });

        setFeeTotal(fee_total);
        setServiceTotal(service_total);
        setSummaryList(summaryData);
      } catch (error) {
        setSummaryDetailList([]);
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const numberFormat = (val) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getInvoiceList = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let result = await invoices(token);

        setInvoiceList(result.data.data);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const summaryTable = () => {
    switch (true) {
      case active === "0":
        return (
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <ScrollView
              style={{
                width: "90%",
                marginBottom: "2.5%",
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.total_card}>
                <View style={styles.card_header_container}>
                  <Text style={[styles.card_header_text, { flex: 3 }]}>
                    สถานะ
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1, textAlign: "right" },
                    ]}
                  >
                    จำนวน
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1.5, textAlign: "right" },
                    ]}
                  >
                    ค่าบริการ
                  </Text>
                </View>

                {summaryList.map((item, index) => (
                  <View style={styles.card_body_container} key={index}>
                    <Text style={[styles.card_body_text, { flex: 3 }]}>
                      {item.name_th}
                    </Text>
                    <Text
                      style={[
                        styles.card_body_text,
                        { flex: 1, textAlign: "right" },
                      ]}
                    >
                      {numberFormat(item.total)}
                    </Text>
                    <Text
                      style={[
                        styles.card_body_text,
                        { flex: 1.5, textAlign: "right" },
                      ]}
                    >
                      {item.serv_cost
                        ? numberFormat(parseFloat(item.serv_cost).toFixed(2))
                        : "0.00"}
                    </Text>
                  </View>
                ))}

                <View
                  style={[styles.card_header_container, { marginTop: "2%" }]}
                >
                  <Text style={[styles.card_header_text, { flex: 3 }]}>
                    รวม
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1, textAlign: "right" },
                    ]}
                  >
                    {serviceTotal}
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1.5, textAlign: "right" },
                    ]}
                  >
                    {numberFormat(parseFloat(feeTotal).toFixed(2))}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      case active === "10":
        return (
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <ScrollView
              style={{
                width: "90%",
                marginBottom: "2.5%",
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.total_card}>
                <View style={styles.card_header_container}>
                  <Text style={[styles.card_header_text, { flex: 1 }]}>
                    หมายเลขงาน
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 2, textAlign: "right" },
                    ]}
                  >
                    เลขที่เอกสาร
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1, textAlign: "right" },
                    ]}
                  >
                    ค่าบริการ
                  </Text>
                </View>
                <ScrollView
                  style={{
                    width: "100%",
                    marginBottom: "2.5%",
                  }}
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                >
                  {invoiceList.map((item, index) => {
                    return (
                      <View style={styles.card_body_container} key={index}>
                        <Text style={[styles.card_body_text, { flex: 1 }]}>
                          {item.jobNo}
                        </Text>
                        <Text
                          style={[
                            styles.card_body_text,
                            { flex: 2, textAlign: "right" },
                          ]}
                        >
                          {item.invNo}
                        </Text>
                        <Text
                          style={[
                            styles.card_body_text,
                            { flex: 1, textAlign: "right" },
                          ]}
                        >
                          {numberFormat(parseFloat(item.total).toFixed(2))}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
                <View
                  style={[styles.card_header_container, { marginTop: "2%" }]}
                >
                  <Text style={[styles.card_header_text, { flex: 3 }]}>
                    รวม
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1.5, textAlign: "right" },
                    ]}
                  >
                    {numberFormat(parseFloat(feeTotal).toFixed(2))}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      default:
        return (
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <ScrollView
              style={{
                width: "90%",
                marginBottom: "2.5%",
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.total_card}>
                <View style={styles.card_header_container}>
                  <Text style={[styles.card_header_text, { flex: 3 }]}>
                    หมายเลขงาน
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1.5, textAlign: "right" },
                    ]}
                  >
                    ค่าบริการ
                  </Text>
                </View>
                <ScrollView
                  style={{
                    width: "100%",
                    marginBottom: "2.5%",
                  }}
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                >
                  {summaryDetailList.map((item, index) => {
                    let total = 0;
                    if (item.status_code === active) {
                      if (!isNaN(item.serv_cost) && item.serv_cost) {
                        total = total + parseFloat(item.serv_cost);
                      }
                      return (
                        <View style={styles.card_body_container} key={index}>
                          <Text style={[styles.card_body_text, { flex: 1 }]}>
                            {item.jobNo}
                          </Text>
                          <Text
                            style={[
                              styles.card_body_text,
                              { flex: 1, textAlign: "right" },
                            ]}
                          >
                            {item.serv_cost && !isNaN(item.serv_cost)
                              ? numberFormat(
                                  parseFloat(item.serv_cost).toFixed(2)
                                )
                              : "0.00"}
                          </Text>
                        </View>
                      );
                    }
                  })}
                </ScrollView>
                <View
                  style={[styles.card_header_container, { marginTop: "2%" }]}
                >
                  <Text style={[styles.card_header_text, { flex: 3 }]}>
                    รวม
                  </Text>
                  <Text
                    style={[
                      styles.card_header_text,
                      { flex: 1.5, textAlign: "right" },
                    ]}
                  >
                    {summaryDetailList.map((item, index) => {
                      let total = 0;
                      if (item.status_code === active) {
                        if (!isNaN(item.serv_cost) && item.serv_cost) {
                          total = total + parseFloat(item.serv_cost);
                        }
                      }

                      if (summaryDetailList.length - 1 === index) {
                        return numberFormat(parseFloat(total).toFixed(2));
                      }
                    })}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        );
    }
  };

  const jobIcon = (job_type) => {
    switch (true) {
      case job_type === "1":
        return CleanIcon;
      case job_type === "2":
        return RepairIcon;
      default:
        return InstallIcon;
    }
  };

  const { update_badge, setModalData } = useContext(TabContext);

  useEffect(() => {
    navigation.addListener("focus", async () => {
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
          setRatingCount(res.data.data[0].rating_count);

          if (!res.data.data[0].verify) {
            Alert.alert("บัญชีของท่านอยู่ระหว่างการตรวจสอบ", "", [
              {
                text: "ตกลง",
                onPress: () => {
                  navigation.navigate({ name: "Profile" });
                },
              },
            ]);
          }
        } catch (error) {
          console.log(error.response.data.message);
        }

        try {
          let noti = await notifications(token);

          let count = 0;

          noti.data.data.map((item) => {
            if (item.status === "1") {
              count++;
            }
          });

          Notifications.setBadgeCountAsync(count);
          update_badge(count);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }

      getUpcomingList();
      getRecommendList();
      getHistoryList();
      getSummaryList();
      getInvoiceList();
    });

    navigation.addListener("blur", () => {
      clearInterval(jobInterval);
    });

    return () => {
      clearInterval(jobInterval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header_container}>
        <Pressable
          style={styles.profile_container}
          onPress={() => navigation.navigate({ name: "Profile" })}
        >
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
          <View style={styles.edit_icon}>
            <MaterialCommunityIcons
              name="pencil"
              color="#ffffff"
              size={normalize(9) > 13 ? 13 : normalize(9)}
            />
          </View>
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
              {parseFloat(rating).toFixed(1)} ({ratingCount} รีวิว)
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
            งานที่กำลังจะมาถึง
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
            ประวัติการรับงาน
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
            สรุปการทำงาน
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
          {upcomingList.length ? (
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
                {upcomingList.map((item, index) => (
                  <Pressable
                    style={styles.job_card_container}
                    key={index}
                    onPress={() =>
                      setModalData({
                        openModal: true,
                        jobID: item.job_id,
                        review: item.review,
                      })
                    }
                  >
                    <Image
                      source={jobIcon(item.job_type_code)}
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
                          หมายเลขงาน: {item.job_id}
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
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.empty_notification}>
              <Text style={styles.empty_notification_title}>ไม่พบงาน</Text>
              <Text style={styles.empty_notification_sub_title}>
                งานของคุณจะปรากฏขึ้นที่นี่
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, minHeight: 50 }}>
          <View style={styles.recommend_header_container}>
            <Text style={styles.recommend_header}>งานแนะนำ</Text>
            <Pressable
              onPress={() => navigation.navigate({ name: "Recommend" })}
            >
              <Text style={styles.recommend_header}>แสดงทั้งหมด</Text>
            </Pressable>
          </View>
          {recommendList.length ? (
            <View style={{ marginHorizontal: "5%", marginTop: "2.5%" }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendList.map((item, index) => (
                  <Pressable
                    style={styles.recommend_card}
                    key={index}
                    onPress={() =>
                      setModalData({
                        openModal: true,
                        jobID: item.job_id,
                        review: item.review,
                      })
                    }
                  >
                    <Image
                      source={jobIcon(item.job_type_code)}
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
                        size={normalize(12) > 22 ? 22 : normalize(12)}
                      />
                      <Text style={styles.recommend_card_description_text}>
                        {item.appointment_date_th}
                      </Text>
                    </View>
                    <View style={styles.recommend_card_description}>
                      <MaterialCommunityIcons
                        name="clock"
                        color="rgba(0,0,0,0.3)"
                        size={normalize(12) > 22 ? 22 : normalize(12)}
                      />
                      <Text style={styles.recommend_card_description_text}>
                        {item.appointment_time}
                      </Text>
                    </View>
                    <View style={styles.recommend_card_description}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        color="rgba(0,0,0,0.3)"
                        size={normalize(12) > 22 ? 22 : normalize(12)}
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
          {historyList.length ? (
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
                {historyList.map((item, index) => (
                  <Pressable
                    style={styles.job_card_container}
                    key={index}
                    onPress={() => {
                      setModalData({
                        openModal: true,
                        jobID: item.job_id,
                        review: item.review,
                      });
                    }}
                  >
                    <Image
                      source={jobIcon(item.job_type_code)}
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
                          หมายเลขงาน: {item.job_id}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.job_card_status}>
                            {item.job_status_en}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.empty_notification}>
              <Text style={styles.empty_notification_title}>ไม่พบงาน</Text>
              <Text style={styles.empty_notification_sub_title}>
                ประวัติการรับงานของคุณจะปรากฏขึ้นที่นี่
              </Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          transform: [{ scale: tab === 3 ? 1 : 0 }],
          flex: tab === 3 ? 1 : 0,
          backgroundColor: "#e6e6e6",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.summary_card_container}>
            <View style={styles.summary_btn_container}>
              <Pressable
                style={[
                  styles.summary_btn,
                  {
                    borderColor:
                      active === "0" ? "#b31117" : "rgba(135,135,135, 0.35)",
                    backgroundColor: active === "0" ? "#b31117" : "#ffffff",
                  },
                ]}
                onPress={() => setActive("0")}
              >
                <Text
                  style={[
                    styles.summary_btn_text,
                    {
                      color: active === "0" ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  ภาพรวม
                </Text>
              </Pressable>
              {summaryList.map((item, index) => (
                <Pressable
                  style={[
                    styles.summary_btn,
                    {
                      borderColor:
                        active === item.status_code
                          ? "#b31117"
                          : "rgba(135,135,135, 0.35)",
                      backgroundColor:
                        active === item.status_code ? "#b31117" : "#ffffff",
                    },
                  ]}
                  key={index}
                  onPress={() => setActive(item.status_code)}
                >
                  <Text
                    style={[
                      styles.summary_btn_text,
                      {
                        color:
                          active === item.status_code ? "#ffffff" : "#000000",
                      },
                    ]}
                  >
                    {item.name_th}
                  </Text>
                </Pressable>
              ))}
            </View>
            {summaryTable()}
          </View>
        </View>
      </View>
      <JobInfoModal
        updateUpcoming={getUpcomingList}
        updateRecommend={getRecommendList}
        nav={navigation}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
