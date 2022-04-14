import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../../components/font";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  tab_container: {
    marginTop: "3.5%",
    flexDirection: "row",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 0,
    backgroundColor: "#ffffff",
    zIndex: 1,
    width: "100%",
    justifyContent: "space-around",
  },
  tab_header: {
    flex: 1,
    alignItems: "center",
  },
  tab_title: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#b31117",
    opacity: 0.5,
    marginBottom: height * 0.005,
  },
  tab_bar: {
    width: "100%",
    height: height * 0.005,
    backgroundColor: "transparent",
  },
  tab_active: {
    opacity: 1,
  },
  tab_bar_active: {
    backgroundColor: "#b31117",
  },
  tab_inactive: {
    color: "#000000",
  },
  tab_icon: {
    width: height * 0.045 > 55 ? 55 : height * 0.045,
    height: height * 0.045 > 55 ? 55 : height * 0.045,
    borderRadius: (height * 0.18) / 2,
    marginVertical: "2%",
    backgroundColor: "#ffffff",
    marginBottom: "5%",
  },
  error_card_container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: "5%",
    paddingVertical: "2.5%",
    justifyContent: "center",
    borderBottomColor: "#e6e6e6",
    borderBottomWidth: 1,
  },
  error_card_text: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
  },
  error_code_title_container: {
    backgroundColor: "#b31117",
    paddingHorizontal: "5%",
    paddingVertical: "1.5%",
  },
  error_code_title: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(13) > 17 ? 17 : normalize(13),
    color: "#ffffff",
  },
  error_code_decs_container: {
    paddingHorizontal: "5%",
    paddingVertical: "1.5%",
  },
  error_code_decs: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(13) > 17 ? 17 : normalize(13),
  },
  clip_container: {
    height: Math.round((width * 9) / 16),
    width: width,
  },
});
