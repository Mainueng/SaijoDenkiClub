import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { warranty_info } from "../../api/warranty";
import styles from "../../assets/stylesheet/warranty/warranty";

const WarrantyInfoScreen = ({ navigation, route }) => {
  const [warrantyInfoIndoor, setWarrantyInfoIndoor] = useState([]);
  const [warrantyInfoOutdoor, setWarrantyInfoOutdoor] = useState([]);

  const { height } = Dimensions.get("window");

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        if (route.params?.indoor && route.params?.outdoor) {
          try {
            let info = await warranty_info(
              token,
              route.params.indoor,
              route.params.outdoor
            );

            setWarrantyInfoIndoor(info.data.data[0]);
            setWarrantyInfoOutdoor(info.data.data[1]);
          } catch (error) {
            console.log(error.response.data.message);
          }
        } else {
          try {
            let res = await warranty_validate(
              token,
              route.params?.serial_number ? route.params.serial_number : ""
            );

            try {
              let info = await warranty_info(
                token,
                res.data.data[0].indoor_serial,
                res.data.data[0].outdoor_serial
              );

              setWarrantyInfoIndoor(info.data.data[0]);
              setWarrantyInfoOutdoor(info.data.data[1]);
            } catch (error) {
              console.log(error);
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar style="dark" />
      <View style={[styles.card, { marginTop: height * 0.01 }]}>
        <View style={styles.top_content}>
          <Text style={styles.title}>AC Modal</Text>
          <Text style={styles.text_des}>
            {route.params?.model ? route.params.model : warrantyInfoIndoor.type}
          </Text>
        </View>
        <View style={styles.bottom_content}>
          <View style={styles.left_content}>
            <Text style={styles.sub_title}>Indoor</Text>
            <Text style={styles.text_des}>{warrantyInfoIndoor.serial}</Text>
          </View>
          <View style={styles.right_content}>
            <Text style={styles.sub_title}>Outdoor</Text>
            <Text style={styles.text_des}>{warrantyInfoOutdoor.serial}</Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <View style={[styles.bottom_content, { paddingTop: height * 0.01 }]}>
          {warrantyInfoIndoor.warranty_info &&
            warrantyInfoIndoor.warranty_info.map((item, index) =>
              item.warranty_category === "parts" ? (
                <View
                  style={[styles.left_content, { paddingTop: 0 }]}
                  key={index}
                >
                  <Text style={styles.title}>รับประกันอะไหล่</Text>
                  <Text style={styles.sub_title}>วันลงทะเบียนการรับประกัน</Text>
                  <Text style={styles.text_des}>
                    {warrantyInfoIndoor.active_date}
                  </Text>
                  <Text style={styles.sub_title}>วันหมดอายุการรับประกัน</Text>
                  <Text style={styles.text_des}>{item.e_warranty}</Text>
                </View>
              ) : null
            )}
          {warrantyInfoOutdoor.warranty_info &&
            warrantyInfoOutdoor.warranty_info.map((item, index) =>
              item.warranty_category === "compressor" ? (
                <View
                  style={[styles.right_content, { paddingTop: 0 }]}
                  key={index}
                >
                  <Text style={styles.title}>รับประกันคอมเพรสเซอร์</Text>
                  <Text style={styles.sub_title}>วันลงทะเบียนการรับประกัน</Text>
                  <Text style={styles.text_des}>
                    {warrantyInfoOutdoor.active_date}
                  </Text>
                  <Text style={styles.sub_title}>วันหมดอายุการรับประกัน</Text>
                  <Text style={styles.text_des}>{item.e_warranty}</Text>
                </View>
              ) : null
            )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WarrantyInfoScreen;
