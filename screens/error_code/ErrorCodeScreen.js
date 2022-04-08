import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/error_code/error_code";
import IndoorIcon from "../../assets/image/error_code/indoor_icon.png";
import OutdoorIcon from "../../assets/image/error_code/outdoor_icon.png";
import SystemIcon from "../../assets/image/error_code/system_icon.png";
import { errors } from "../../api/error_code";

const ErrorCodeScreen = ({ navigation, route }) => {
  const [tab, setTab] = useState(1);
  const [indoorList, setIndoorList] = useState([]);
  const [outdoorList, setOutdoorList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let res = await errors(token);

          let indoor = res.data.data.filter((item) => {
            return item.header === "Indoor Unit";
          });

          let outdoor = res.data.data.filter((item) => {
            return item.header === "Outdoor Unit";
          });

          let system = res.data.data.filter((item) => {
            return item.header === "System";
          });

          setIndoorList(indoor[0].body);
          setOutdoorList(outdoor[0].body);
          setSystemList(system[0].body);
        } catch (error) {
          console.log(error.response.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.tab_container}>
        <Pressable style={styles.tab_header} onPress={() => setTab(1)}>
          <Image
            source={IndoorIcon}
            resizeMode={"cover"}
            style={styles.tab_icon}
          />
          <Text
            style={[
              styles.tab_title,
              tab === 1 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            Indoor Unit
          </Text>
          <View
            style={[styles.tab_bar, tab === 1 ? styles.tab_bar_active : null]}
          ></View>
        </Pressable>
        <Pressable style={styles.tab_header} onPress={() => setTab(2)}>
          <Image
            source={OutdoorIcon}
            resizeMode={"cover"}
            style={styles.tab_icon}
          />
          <Text
            style={[
              styles.tab_title,
              tab === 2 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            Outdoor Unit
          </Text>
          <View
            style={[styles.tab_bar, tab === 2 ? styles.tab_bar_active : null]}
          ></View>
        </Pressable>
        <Pressable style={styles.tab_header} onPress={() => setTab(3)}>
          <Image
            source={SystemIcon}
            resizeMode={"cover"}
            style={styles.tab_icon}
          />
          <Text
            style={[
              styles.tab_title,
              tab === 3 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            System
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
        <ScrollView
          style={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {indoorList.length && null}
        </ScrollView>
      </View>
      <View
        style={{
          width: "100%",
          transform: [{ scale: tab === 2 ? 1 : 0 }],
          flex: tab === 2 ? 1 : 0,
          backgroundColor: "#e6e6e6",
        }}
      >
        <ScrollView
          style={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {outdoorList.length && null}
        </ScrollView>
      </View>
      <View
        style={{
          width: "100%",
          transform: [{ scale: tab === 3 ? 1 : 0 }],
          flex: tab === 2 ? 1 : 0,
          backgroundColor: "#e6e6e6",
        }}
      >
        {systemList.length && (
          <ScrollView
            style={{
              width: "100%",
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {indoorList.length && null}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ErrorCodeScreen;
