import React, { useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "../../assets/stylesheet/error_code/error_code";
import { WebView } from "react-native-webview";

const ErrorCodeDescriptionScreen = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "รหัสความผิดปกติ: " + route.params.error_code.padStart(2, "0"),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View>
        <View style={styles.error_code_title_container}>
          <Text style={styles.error_code_title}>ปัญหา</Text>
        </View>
        <View style={styles.error_code_decs_container}>
          <Text style={styles.error_code_decs}>
            {route.params?.problem ? route.params.problem : ""}
          </Text>
        </View>
        <View style={styles.error_code_title_container}>
          <Text style={styles.error_code_title}>วิธีแก้ปัญหา</Text>
        </View>
        <View style={styles.error_code_decs_container}>
          <Text style={styles.error_code_decs}>
            {route.params?.problem ? route.params.solution : ""}
          </Text>
        </View>
        <View style={styles.error_code_title_container}>
          <Text style={styles.error_code_title}>คลิป</Text>
        </View>
        <View style={styles.clip_container}>
          <WebView
            style={{ width: "100%" }}
            javaScriptEnabled={true}
            source={{ uri: route.params?.link ? route.params.link : null }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ErrorCodeDescriptionScreen;
