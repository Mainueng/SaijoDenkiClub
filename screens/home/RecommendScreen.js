import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { TabContext } from "../../components/tab_context";
import { useIsFocused } from "@react-navigation/native";

import CleanIcon from "../../assets/image/home/clean_icon.png";
import RepairIcon from "../../assets/image/home/repair_icon.png";
import InstallIcon from "../../assets/image/home/install_icon.png";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const RecommendScreen = ({ navigation }) => {
  const [recommendList, setRecommendList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { setModalData } = useContext(TabContext);

  const isFocused = useIsFocused();

  useEffect(() => {
    getRecommendList();
  }, [isFocused]);

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
        updateUpcoming={null}
        updateRecommend={getRecommendList}
        nav={navigation}
        getNotification={null}
      />
    </SafeAreaView>
  );
};

export default RecommendScreen;
