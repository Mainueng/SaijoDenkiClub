import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Pressable,
  Text,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/notification/notification";
import CleanIcon from "../../assets/image/home/clean_icon.png";
import RepairIcon from "../../assets/image/home/repair_icon.png";
import InstallIcon from "../../assets/image/home/install_icon.png";
import { notifications, read_all, read, remove } from "../../api/notification";
import NotificationCard from "../../components/notification_card";
import { TabContext } from "../../components/tab_context";
import JobInfoModal from "../../components/job_info_modal";
import * as Notifications from "expo-notifications";

const NotificationScreen = ({ navigation, route }) => {
  const [tab, setTab] = useState(1);
  const [cleanList, setCleanList] = useState([]);
  const [repairList, setRepairList] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const [cleanTotal, setCleanTotal] = useState(0);
  const [repairTotal, setRepairTotal] = useState(0);
  const [otherTotal, setOtherTotal] = useState(0);
  const [modalData, setModalData] = useState({});

  const { update_badge } = useContext(TabContext);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getNotification();
    });
  }, []);

  const getNotification = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await notifications(token);

        let cleans = res.data.data.filter((item) => {
          return item.job_type === "1";
        });

        let repairs = res.data.data.filter((item) => {
          return item.job_type === "2";
        });

        let others = res.data.data.filter((item) => {
          return item.job_type !== "1" && item.job_type !== "2";
        });

        let clean_count = 0;
        let repair_count = 0;
        let other_count = 0;

        cleans.map((item, index) => {
          item.key = index + 1;

          if (item.status === "1") {
            clean_count++;
          }

          return item;
        });

        repairs.map((item, index) => {
          item.key = index + 1;

          if (item.status === "1") {
            repair_count++;
          }

          return item;
        });

        others.map((item, index) => {
          item.key = index + 1;

          if (item.status === "1") {
            other_count++;
          }

          return item;
        });

        setCleanList(cleans);
        setRepairList(repairs);
        setOtherList(others);
        setCleanTotal(clean_count);
        setRepairTotal(repair_count);
        setOtherTotal(other_count);

        update_badge(clean_count + repair_count + other_count);

        Notifications.setBadgeCountAsync(
          clean_count + repair_count + other_count
        );
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, job_id) => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        await remove(token, job_id);
        getNotification();
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const readAll = async (type) => {
    try {
      let token = await AsyncStorage.getItem("token");

      switch (true) {
        case type === 1:
          try {
            await read_all(token, 1);
            getNotification();
          } catch (error) {
            console.log(error.response.data.message);
          }
          break;
        case type === 2:
          try {
            await read_all(token, 2);
            getNotification();
          } catch (error) {
            console.log(error.response.data.message);
          }
          break;
        default:
          try {
            await read_all(token, 3);
            await read_all(token, 4);
            await read_all(token, 5);
            await read_all(token, 6);
            getNotification();
          } catch (error) {
            console.log(error.response.data.message);
          }
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const readHandle = async (job_id) => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        await read(token, job_id);
        getNotification();

        setModalData({
          openModal: true,
          jobID: job_id,
          review: 0,
        });
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar style="dark" />
      <View style={styles.tab_container}>
        <Pressable style={styles.tab_header} onPress={() => setTab(1)}>
          <View style={{ position: "relative" }}>
            <View
              style={[
                styles.notification_badge_container,
                { display: cleanTotal ? "flex" : "none" },
              ]}
            >
              <Text style={styles.notification_badge}>
                {cleanTotal > 99 ? "99+" : cleanTotal}
              </Text>
            </View>
            <Image
              source={CleanIcon}
              resizeMode={"cover"}
              style={styles.tab_icon}
            />
          </View>
          <Text
            style={[
              styles.tab_title,
              tab === 1 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            ล้างแอร์
          </Text>
          <View
            style={[styles.tab_bar, tab === 1 ? styles.tab_bar_active : null]}
          ></View>
        </Pressable>
        <Pressable style={styles.tab_header} onPress={() => setTab(2)}>
          <View style={{ position: "relative" }}>
            <View
              style={[
                styles.notification_badge_container,
                { display: repairTotal ? "flex" : "none" },
              ]}
            >
              <Text style={styles.notification_badge}>
                {repairTotal > 99 ? "99+" : repairTotal}
              </Text>
            </View>
            <Image
              source={RepairIcon}
              resizeMode={"cover"}
              style={styles.tab_icon}
            />
          </View>
          <Text
            style={[
              styles.tab_title,
              tab === 2 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            ซ่อมแอร์
          </Text>
          <View
            style={[
              styles.tab_bar,
              tab === 2 ? styles.tab_bar_active : styles.tab_inactive,
            ]}
          ></View>
        </Pressable>
        <Pressable style={styles.tab_header} onPress={() => setTab(3)}>
          <View style={{ position: "relative" }}>
            <Image
              source={InstallIcon}
              resizeMode={"cover"}
              style={styles.tab_icon}
            />
            <View
              style={[
                styles.notification_badge_container,
                { display: otherTotal ? "flex" : "none" },
              ]}
            >
              <Text style={styles.notification_badge}>
                {otherTotal > 99 ? "99+" : otherTotal}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.tab_title,
              tab === 3 ? styles.tab_active : styles.tab_inactive,
            ]}
          >
            งานโครงการ
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
        <View style={styles.notification_list_container}>
          <Pressable
            style={{
              marginBottom: "2%",
              paddingLeft: "5%",
              paddingTop: "3.5%",
            }}
            onPress={() => readAll(1)}
          >
            <Text style={styles.read_all_text}>อ่านทั้งหมด</Text>
          </Pressable>
          {cleanList.length ? (
            <View
              style={{
                width: "100%",
                flex: 1,
                paddingLeft: "5%",
              }}
            >
              <NotificationCard
                data={cleanList}
                deleteRow={(data, index) => deleteRow(data, index)}
                closeRow={(rowMap, rowKey) => closeRow(rowMap, rowKey)}
                readHandle={readHandle}
              />
            </View>
          ) : (
            <View style={styles.empty_notification}>
              <Text style={styles.empty_notification_title}>
                ไม่พบการแจ้งเตือน
              </Text>
              <Text style={styles.empty_notification_sub_title}>
                การแจ้งเตือนเกี่ยวกับงานของคุณจะปรากฏขึ้นที่นี่
              </Text>
            </View>
          )}
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
        <View style={styles.notification_list_container}>
          <Pressable
            style={{
              marginBottom: "2%",
              paddingLeft: "5%",
              paddingTop: "3.5%",
            }}
            onPress={() => readAll(2)}
          >
            <Text style={styles.read_all_text}>อ่านทั้งหมด</Text>
          </Pressable>
          {repairList.length ? (
            <View
              style={{
                width: "100%",
                flex: 1,
                paddingLeft: "5%",
              }}
            >
              <NotificationCard
                data={repairList}
                deleteRow={(data, index) => deleteRow(data, index)}
                closeRow={(rowMap, rowKey) => closeRow(rowMap, rowKey)}
                readHandle={readHandle}
              />
            </View>
          ) : (
            <View style={styles.empty_notification}>
              <Text style={styles.empty_notification_title}>
                ไม่พบการแจ้งเตือน
              </Text>
              <Text style={styles.empty_notification_sub_title}>
                การแจ้งเตือนเกี่ยวกับงานของคุณจะปรากฏขึ้นที่นี่
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
        <View style={styles.notification_list_container}>
          <Pressable
            style={{
              marginBottom: "2%",
              paddingLeft: "5%",
              paddingTop: "3.5%",
            }}
            onPress={() => readAll(3)}
          >
            <Text style={styles.read_all_text}>อ่านทั้งหมด</Text>
          </Pressable>
          {otherList.length ? (
            <View
              style={{
                width: "100%",
                flex: 1,
                paddingLeft: "5%",
              }}
            >
              <NotificationCard
                data={otherList}
                deleteRow={(data, index) => deleteRow(data, index)}
                closeRow={(rowMap, rowKey) => closeRow(rowMap, rowKey)}
                readHandle={readHandle}
              />
            </View>
          ) : (
            <View style={styles.empty_notification}>
              <Text style={styles.empty_notification_title}>
                ไม่พบการแจ้งเตือน
              </Text>
              <Text style={styles.empty_notification_sub_title}>
                การแจ้งเตือนเกี่ยวกับงานของคุณจะปรากฏขึ้นที่นี่
              </Text>
            </View>
          )}
        </View>
      </View>
      <JobInfoModal
        modalData={modalData}
        updateUpcoming={null}
        updateRecommend={null}
        nav={navigation}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
