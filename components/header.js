import React from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { normalize } from "./font";

const Header = ({ navigation, title = "", back = true }) => {
  return (
    <View style={styles.header_container}>
      <Text style={styles.header_title}>{title}</Text>
      <Pressable
        style={[styles.back_btn_container, { opacity: back ? 1 : 0 }]}
        onPress={() => navigation.goBack()}
        disabled={back ? false : true}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          color="#b31117"
          size={normalize(36) > 42 ? 42 : normalize(36)}
        />
      </Pressable>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const scale = height > width ? height : width;

const styles = StyleSheet.create({
  header_container: {
    height: "7%",
    minHeight: 65,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? 0 : "2.5%",
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header_title: {
    fontSize: normalize(18) > 24 ? 24 : normalize(18),
    fontFamily: "Sukhumvit_SemiBold",
    color: "#000000",
  },
  back_btn_container: {
    position: "absolute",
    left: "3%",
  },
  back_btn: {
    height: scale * 0.03,
    width: scale * 0.03,
  },
});

export default Header;
