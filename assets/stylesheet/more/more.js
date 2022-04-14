import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../../components/font";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  banner_container: {
    paddingVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#e6e6e6",
  },
  banner_image: {
    width: width * 0.45,
  },
  version: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
  },
  link_icon_container: {
    width: "100%",
    borderStyle: "dashed",
    borderColor: "#ffffff",
    borderTopColor: "#e6e6e6",
    borderWidth: 1.5,
  },
  title: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    marginLeft: "5%",
    marginTop: "3%",
    marginBottom: "1%",
  },
  icon_container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  icon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon_text: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
  },
  icon_image: {
    height: width * 0.12,
    marginVertical: "5%",
  },
});
