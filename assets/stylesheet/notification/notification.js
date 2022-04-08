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
  read_all_text: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(14) > 20 ? 20 : normalize(14),
    opacity: 0.5,
  },
  notification_list_container: {
    flex: 1,
    //paddingHorizontal: "5%",
  },
  notification_card: {
    flexDirection: "row",
    marginBottom: height * 0.01,
    backgroundColor: "#ffffff",
    borderRadius: height * 0.005,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "95%",
    position: "relative",
  },
  notification_title: {
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_SemiBold",
    paddingTop: height * 0.01,
    paddingLeft: width * 0.035,
  },
  notification_card_header: {
    width: width * 0.015,
    backgroundColor: "#b31117",
    borderTopLeftRadius: height * 0.005,
    borderBottomLeftRadius: height * 0.005,
  },
  notification_detail: {
    fontSize: normalize(12) > 14 ? 14 : normalize(12),
    fontFamily: "Sukhumvit_Medium",
    paddingLeft: width * 0.035,
    color: "rgba(0,0,0,0.35)",
  },
  delete_notification_container: {
    backgroundColor: "red",
    paddingRight: "5%",
    width: "95%",
    flex: 1,
    marginBottom: height * 0.01,
    borderRadius: height * 0.005,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  delete_card_title: {
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_SemiBold",
    color: "#ffffff",
  },
  active: {
    position: "absolute",
    height: width * 0.02,
    width: width * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "#b31117",
    right: "3%",
    top: "12%",
  },
  notification_badge_container: {
    backgroundColor: "#11B3AD",
    borderRadius: width,
    justifyContent: "center",
    alignItems: "center",
    minWidth: width * 0.05,
    minHeight: width * 0.05,
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: 0,
    right: "-5%",
  },
  notification_badge: {
    color: "#ffffff",
    fontSize: normalize(9) > 13 ? 13 : normalize(9),
    fontFamily: "Sukhumvit_Bold",
  },
  empty_notification: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty_notification_title: {
    fontSize: normalize(18) > 22 ? 22 : normalize(18),
    fontFamily: "Sukhumvit_Medium",
    opacity: 0.35,
  },
  empty_notification_sub_title: {
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_Medium",
    opacity: 0.35,
  },
});
