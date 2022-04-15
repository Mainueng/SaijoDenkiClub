import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../../components/font";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  current_btn: {
    position: "absolute",
    top: "3%",
    right: "4%",
    padding: "2%",
    alignContent: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 0,
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
  save_button: {
    position: "absolute",
    bottom: "5.5%",
    paddingVertical: "5.5%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 0,
    backgroundColor: "#b31117",
    zIndex: 1,
    width: "22.5%",
    borderRadius: width * 0.01,
  },
  save_button_text: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#ffffff",
  },
});
