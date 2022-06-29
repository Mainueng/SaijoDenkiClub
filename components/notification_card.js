import React from "react";
import { Text, View, Pressable, Dimensions } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import styles from "../assets/stylesheet/notification/notification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { normalize } from "./font";

const { width } = Dimensions.get("window");

const NotificationCard = ({ data, closeRow, deleteRow, readHandle }) => {
  return (
    <SwipeListView
      disableRightSwipe
      data={data}
      renderItem={(data, index) => (
        <Pressable
          style={styles.notification_card}
          key={index}
          onPress={() => readHandle(data.item.job_id)}
        >
          <View style={data.item.status === "1" ? styles.active : null} />
          <View style={styles.notification_card_header} />
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={[
                styles.notification_title,
                {
                  marginTop: 0,
                },
              ]}
            >
              {data.item.job_id} - {data.item.name} {data.item.lastname}
            </Text>
            <Text style={styles.notification_detail}>
              {data.item.address}
              {"\n"}
              {data.item.district} {data.item.province} {data.item.postal_code}
            </Text>
            <View
              style={{
                alignItems: "flex-end",
                paddingRight: "5%",
                marginBottom: "1%",
              }}
            >
              <Text
                style={[
                  styles.notification_detail,
                  { color: "#000000", fontFamily: "Sukhumvit_SemiBold" },
                ]}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={normalize(14) > 24 ? 24 : normalize(14)}
                  color={"rgba(0,0,0,0.75)"}
                />
                {data.item.radius}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
      renderHiddenItem={(data, rowMap) => (
        <Pressable
          style={styles.delete_notification_container}
          onPress={() => {
            closeRow(rowMap, data.item.key);
            deleteRow(rowMap, data.item.job_id);
          }}
        >
          <Text style={styles.delete_card_title}>ลบ</Text>
        </Pressable>
      )}
      rightOpenValue={-width * 0.15}
      previewOpenValue={-width * 0.15}
      previewOpenDelay={3000}
    ></SwipeListView>
  );
};

export default NotificationCard;
