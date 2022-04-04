import React, { useState, useEffect, useCallback } from "react";
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
import TextTicker from "react-native-text-ticker";

import { recommend } from "../../api/jobs";
import JobInfoModal from "../../components/job_info_modal";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const RecommendScreen = ({ navigation }) => {
  const [recommendList, setRecommendList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    navigation.addListener("focus", () => {
      getRecommendList();
    });
  }, []);

  const onRefreshRecommend = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(async () => {
      getRecommendList();
      setRefreshing(false);
    });
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.recommend_list_container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshRecommend}
            />
          }
        >
          <View style={styles.recommend_list}>
            {recommendList.length
              ? recommendList.map((item, index) => (
                  <Pressable
                    style={[
                      styles.recommend_card,
                      (index + 1) % 3 ? null : { marginRight: 0 },
                    ]}
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
                ))
              : null}
          </View>
        </ScrollView>
        <Pressable
          style={styles.recommend_map_button}
          onPress={() => navigation.navigate({ name: "Job Location" })}
        >
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            color="#ffffff"
            size={normalize(30) > 40 ? 40 : normalize(30)}
          />
        </Pressable>
      </View>
      <JobInfoModal
        modalData={modalData}
        updateUpcoming={null}
        updateRecommend={getRecommendList}
        nav={navigation}
      />
    </SafeAreaView>
  );
};

export default RecommendScreen;
