import { StyleSheet, Dimensions, Platform } from "react-native";
import { normalize } from "../../../components/font";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  header_container: {
    marginTop: "3%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  header_right_container: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: "3.5%",
  },
  profile_container: {
    paddingLeft: "6.5%",
    position: "relative",
  },
  profile_image: {
    width: height * 0.065 > 85 ? 85 : height * 0.065,
    height: height * 0.065 > 85 ? 85 : height * 0.065,
    borderRadius: (height * 0.18) / 2,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#b31117",
  },
  name_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: normalize(14) > 20 ? 20 : normalize(14),
    fontFamily: "Sukhumvit_Medium",
    marginLeft: "3%",
    // color: "#b31117",
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
  job_card_container: {
    backgroundColor: "#ffffff",
    width: "90%",
    marginTop: "2%",
    paddingHorizontal: "4%",
    paddingVertical: Platform.OS === "ios" ? "2%" : "2.5%",
    borderRadius: height * 0.01,
    borderWidth: 1,
    borderColor: "rgba(135,135,135, 0.35)",
    flexDirection: "row",
    alignItems: "center",
  },
  job_type_image: {
    width: height * 0.055 > 65 ? 65 : height * 0.055,
    height: height * 0.055 > 65 ? 65 : height * 0.055,
    borderRadius: (height * 0.18) / 2,
    marginVertical: "2%",
    backgroundColor: "#ffffff",
  },
  job_card_description: {
    flex: 1,
    marginLeft: "5%",
    justifyContent: "center",
  },
  job_card_status_container: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: "-1.5%",
  },
  job_card_status: {
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    fontFamily: "Sukhumvit_Medium",
    color: "#b31117",
  },
  job_card_description_header: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    // marginBottom: "-1%",
  },
  job_card_description_text: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    color: "rgba(0,0,0,0.75)",
    marginBottom: "-1%",
  },
  recommend_header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "5%",
  },
  recommend_header: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(15) > 19 ? 19 : normalize(15),
    color: "rgba(0,0,0,0.75)",
  },
  recommend_card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: width * 0.015,
    paddingTop: height * 0.015,
    paddingBottom: height * 0.01,
    borderRadius: height * 0.01,
    borderWidth: 1,
    borderColor: "rgba(135,135,135, 0.35)",
    width: width * 0.275,
    marginBottom: "2%",
    marginRight: width * 0.02,
  },
  recommend_image: {
    width: height * 0.06 > 65 ? 65 : height * 0.06,
    height: height * 0.06 > 65 ? 65 : height * 0.06,
    borderRadius: (height * 0.18) / 2,
    marginBottom: "10%",
    backgroundColor: "#ffffff",
  },
  recommend_card_description_header: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
  },
  recommend_card_description: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2.5%",
  },
  recommend_card_description_text: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    color: "rgba(0,0,0,0.75)",
    marginBottom: "-3%",
    marginLeft: "2.5%",
  },
  modal_background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modal_container: {
    width: "90%",
    height: "80%",
    maxWidth: 500,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    shadowColor: "#000000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modal_header_container: {
    height: "15%",
    width: "100%",
    backgroundColor: "#b31117",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: "5%",
    flexDirection: "row",
    position: "relative",
  },
  modal_profile_image: {
    width: height * 0.055 > 75 ? 75 : height * 0.055,
    height: height * 0.055 > 75 ? 75 : height * 0.055,
    borderRadius: (height * 0.18) / 2,
    backgroundColor: "#ffffff",
  },
  modal_name_container: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: "2.5%",
    flex: 1,
  },
  modal_name: {
    fontSize: normalize(15) > 19 ? 19 : normalize(15),
    fontFamily: "Sukhumvit_SemiBold",
    marginLeft: "3%",
    color: "#ffffff",
    marginBottom: "-3%",
  },
  modal_job_id: {
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_Medium",
    marginLeft: "3%",
    color: "rgba(255,255,255,0.75)",
  },
  modal_body_container: {
    flex: 1,
    height: "85%",
    width: "100%",
    borderBottomLeftRadius: height * 0.0075,
    borderBottomRightRadius: height * 0.0075,
    padding: "5%",
    position: "relative",
  },
  modal_body_info_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal_info_header: {
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_SemiBold",
    marginLeft: "2%",
  },
  modal_info_title: {
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    fontFamily: "Sukhumvit_Medium",
    marginLeft: "2%",
  },
  modal_info_description: {
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    fontFamily: "Sukhumvit_Medium",
    marginLeft: "2%",
    color: "rgba(0,0,0,0.75)",
  },
  modal_info_description_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  map_container: {
    height: height * 0.2,
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: height * 0.00375,
  },
  modal_log_bar: {
    height: "100%",
    width: width * 0.004,
    backgroundColor: "rgba(0,0,0,0.15)",
    position: "absolute",
    left: "7%",
  },
  close_modal_btn: {
    position: "absolute",
    top: "10%",
    right: "2.5%",
  },
  modal_button_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4%",
    marginHorizontal: "5%",
  },
  call_button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#11B3AD",
    flex: 1,
    padding: "1.5%",
    borderRadius: height * 0.00375,
    marginLeft: "1.5%",
  },
  checkin_button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b31117",
    flex: 1,
    padding: "1.5%",
    borderRadius: height * 0.00375,
    marginRight: "1.5%",
  },
  modal_button_text: {
    color: "#ffffff",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_Medium",
  },
  cancel_button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    flex: 1,
    padding: "1.5%",
    borderRadius: height * 0.00375,
  },
  summary_button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#11B3AD",
    flex: 1,
    padding: "1.5%",
    borderRadius: height * 0.00375,
  },
  recommend_list_container: {
    width: "100%",
    flex: 1,
    paddingTop: "5%",
    paddingHorizontal: "5%",
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    position: "relative",
  },
  recommend_list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  recommend_list_card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: "2%",
    paddingVertical: height * 0.015,
    borderRadius: height * 0.01,
    borderWidth: 1,
    borderColor: "rgba(135,135,135, 0.35)",
    width: width * 0.275,
    marginBottom: "2%",
    marginLeft: width * 0.02,
  },
  recommend_map_button: {
    backgroundColor: "#b31117",
    position: "absolute",
    padding: height * 0.01,
    borderRadius: height,
    bottom: "3%",
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  summary_card_container: {
    alignItems: "center",
    flex: 1,
  },
  summary_btn_container: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
  },
  total_card: {
    backgroundColor: "#ffffff",
    width: "100%",
    marginTop: "2%",
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: height * 0.01,
    borderWidth: 1,
    borderColor: "rgba(135,135,135, 0.35)",
    alignItems: "center",
  },
  card_header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  card_body_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomColor: "rgba(0,0,0,0.75)",
    borderBottomWidth: 1,
    marginTop: "2%",
  },
  card_header_text: {
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    fontFamily: "Sukhumvit_SemiBold",
  },
  card_body_text: {
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    fontFamily: "Sukhumvit_Medium",
    color: "rgba(0,0,0,0.75)",
  },
  summary_btn: {
    width: "49.5%",
    // backgroundColor: "#ffffff",
    marginTop: "2%",
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: height * 0.005,
    borderWidth: 1,
    // borderColor: "rgba(135,135,135, 0.35)",
    alignItems: "center",
  },
  summary_btn_text: {
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
    fontFamily: "Sukhumvit_Medium",
  },
  modal_invoice_image: {
    width: height * 0.045 > 65 ? 65 : height * 0.045,
    height: height * 0.045 > 65 ? 65 : height * 0.045,
    borderRadius: (height * 0.18) / 2,
    backgroundColor: "#ffffff",
  },
  modal_info_container: {
    width: "100%",
    paddingHorizontal: "5%",
    paddingBottom: "1%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slip_image_container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slip_image: {
    aspectRatio: 1,
    width: "90%",
  },
  paging_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  page_bullet: {
    height: height * 0.01,
    width: height * 0.01,
    borderRadius: height * 0.01,
    backgroundColor: "#e6e6e6",
    marginHorizontal: width * 0.01,
    marginBottom: height * 0.02,
  },
  active_bullet: {
    backgroundColor: "#b31117",
  },
  edit_icon: {
    position: "absolute",
    backgroundColor: "#b31117",
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width,
    right: 0,
    bottom: 0,
  },
  modal_info_image_container: {
    flexDirection: "row",
  },
  problem_image_thumb: {
    width: height * 0.055 > 75 ? 75 : height * 0.055,
    height: height * 0.055 > 75 ? 75 : height * 0.055,
    borderRadius: width * 0.01,
  },
  modal_header: {
    padding: height * 0.01,
    backgroundColor: "#b31117",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    borderTopRightRadius: height * 0.005,
    borderTopLeftRadius: height * 0.005,
    position: "relative",
  },
  modal_header_text: {
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_SemiBold",
    color: "#ffffff",
  },
  close_problem_btn: {
    position: "absolute",
    right: "2.5%",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modal_body: {
    width: "100%",
  },
  modal_problem_image: {
    width: "100%",
    maxWidth: 600,
    aspectRatio: 1,
    borderBottomRightRadius: height * 0.005,
    borderBottomLeftRadius: height * 0.005,
    backgroundColor: "#ffffff",
  },
  empty_notification: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
