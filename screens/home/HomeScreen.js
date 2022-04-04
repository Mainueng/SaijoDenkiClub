import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  RefreshControl,
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
import { upcoming, recommend, history } from "../../api/jobs";
import JobInfoModal from "../../components/job_info_modal";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const HomeScreen = ({ navigation }) => {
  const [tab, setTab] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingList, setUpcomingList] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [jobInterval, setJobInterval] = useState(0);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [userID, setUserID] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [modalData, setModalData] = useState({});

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
          setRatingCount(res.data.data[0].ratingCount);
        } catch (error) {
          console.log(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }

      getUpcomingList();
      getRecommendList();
      getHistoryList();
    });

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
                      onPress={() =>
                        setModalData({
                          openModal: true,
                          jobID: item.job_id,
                          review: item.review,
                        })
                      }
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
        <View style={{ flex: 1, minHeight: 50 }}>
          <View style={styles.recommend_header_container}>
            <Text style={styles.recommend_header}>Recommend</Text>
            <Pressable
              onPress={() => navigation.navigate({ name: "Recommend" })}
            >
              <Text style={styles.recommend_header}>Show All</Text>
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
      <JobInfoModal
        modalData={modalData}
        updateUpcoming={getUpcomingList}
        updateRecommend={getRecommendList}
        nav={navigation}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
