import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/stylesheet/warranty/warranty";
import { certification_info } from "../../api/user";
import moment from "moment";

const VerifyScreen = () => {
  const [verifyCode, setVerifyCode] = useState("");
  const [approveData, setApproveDate] = useState("");
  const [expireData, setExpireDate] = useState("");

  const { height } = Dimensions.get("window");

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        try {
          let res = await certification_info(token);

          setVerifyCode(res.data.data[0].verify_id);
          setApproveDate(
            moment(res.data.data[0].approval_date).format("DD/MM/YYYY")
          );
          setExpireDate(
            moment(res.data.data[0].expiry_date).format("DD/MM/YYYY")
          );
        } catch (error) {
          console.log(error.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar style="light" />
      <View style={[styles.card, { marginTop: height * 0.01 }]}>
        <View style={styles.top_content}>
          <Text style={styles.title}>Saijo Denki Verify</Text>
          <Text style={styles.text_des}>{verifyCode}</Text>
        </View>
        <View style={styles.bottom_content}>
          <View style={styles.left_content}>
            <Text style={styles.sub_title}>อนุมัติวันที่</Text>
            <Text style={styles.text_des}>{approveData}</Text>
          </View>
          <View style={styles.right_content}>
            <Text style={styles.sub_title}>วันหมอายุ</Text>
            <Text style={styles.text_des}>{expireData}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyScreen;
