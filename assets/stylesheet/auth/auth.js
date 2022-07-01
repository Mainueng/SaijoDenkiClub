import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../../components/font";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    flexDirection: "column",
  },
  loading_logo: {
    width: "40%",
    height: "40%",
    marginBottom: 10,
  },
  loading_text: {
    color: "#666666",
    position: "absolute",
    bottom: height * 0.05,
    fontSize: normalize(14) > 24 ? 24 : normalize(14),
    fontFamily: "Sukhumvit_Medium",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
  },
  sub_container: {
    alignItems: "center",
    minHeight: "100%",
    marginTop: "2%",
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  login_logo: {
    height: height * 0.15,
    marginBottom: "10%",
    marginTop: "5%",
  },
  signin_container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input_container: {
    marginBottom: "5.5%",
    width: "80%",
    maxWidth: 500,
    borderColor: "#ffffff",
    borderWidth: 0.75,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: height * 0.0075,
    // shadowColor: "#000000",
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  input_icon_container: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.01,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: width * 0.02,
    marginBottom: width * 0.02,
    borderRightColor: "#b3b3b3",
    borderRightWidth: 0.75,
  },
  input: {
    width: "85%",
    fontSize: normalize(15) > 19 ? 19 : normalize(15),
    fontFamily: "Sukhumvit_Text",
    color: "#666666",
    padding: width * 0.02,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: width * 0.02,
    marginBottom: width * 0.02,
  },
  error_msg: {
    color: "#b31117",
    fontFamily: "Sukhumvit_Medium",
    marginTop: "2%",
    marginBottom: "-1%",
  },
  other_container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "80%",
  },
  signup_container: {
    // width: "50%",
    borderRightColor: "#b3b3b3",
    borderRightWidth: 0.75,
  },
  forget_password_container: {
    //width: "50%",
  },
  signup_text: {
    fontSize: normalize(14) > 20 ? 20 : normalize(14),
    fontFamily: "Sukhumvit_SemiBold",
    color: "#b31117",
    textAlign: "right",
    marginRight: "10%",
  },
  forgot_password: {
    fontSize: normalize(14) > 20 ? 20 : normalize(14),
    fontFamily: "Sukhumvit_SemiBold",
    color: "#999999",
    marginLeft: "10%",
  },
  btn_container: {
    width: "80%",
    maxWidth: 500,
    justifyContent: "space-around",
    marginTop: height * 0.04,
  },
  login_btn: {
    backgroundColor: "#b31117",
    alignItems: "center",
    alignContent: "center",
    borderRadius: height * 0.0075,
  },
  login_btn_text: {
    color: "#ffffff",
    fontFamily: "Sukhumvit_SemiBold",
    padding: height > 900 ? height * 0.005 : height * 0.0075,
    fontSize: normalize(14) > 20 ? 20 : normalize(14),
  },
  or_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
  },
  hr: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#999999",
    height: 1,
    flex: 1,
  },
  hr_text: {
    fontSize: normalize(14) > 20 ? 20 : normalize(14),
    fontFamily: "Sukhumvit_Text",
    color: "#999999",
    marginLeft: "2%",
    marginRight: "2%",
  },
  other_btn: {
    borderWidth: 0.75,
    borderColor: "#ffffff",
    alignItems: "center",
    alignContent: "center",
    borderRadius: height * 0.005,
  },
  signup_btn_container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.01,
  },
  signup_btn: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#ffffff",
    marginLeft: 5,
    height: height * 0.045,
  },
  processing_bg: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
    elevation: 1,
  },
  processing_container: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 25,
    paddingBottom: 15,
    borderRadius: 10,
    backgroundColor: "rgba(68,68,68,0.75)",
  },
  processing_text: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#FFFFFF",
    marginTop: 10,
  },
  social_btn_container: {
    marginTop: height * 0.025,
    width: width * 0.8,
    maxWidth: 500,
  },
  facebook_btn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4267b1",
    borderRadius: height * 0.0075,
    marginBottom: height * 0.025,
    flexDirection: "row",
    marginTop: height * 0.02,
    height: height * 0.045,
  },
  social_btn_text: {
    color: "#ffffff",
    fontFamily: "Sukhumvit_Medium",
    padding: height * 0.0075,
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    flex: 10,
    textAlign: "center",
    marginLeft: width * -0.1,
  },
  apple_btn: {
    shadowColor: "#000000",
    borderRadius: height * 0.0075,
    marginBottom: height * 0.025,
    height: height * 0.045,
    width: "100%",
  },
  line_btn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#06c755",
    shadowColor: "#000000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: height * 0.0045,
    marginBottom: height * 0.025,
    flexDirection: "row",
  },
  social_logo: {
    height: height * 0.025,
    flex: 2,
  },
  form_container: {
    paddingTop: height * 0.005,
    paddingBottom: height * 0.03,
    backgroundColor: "#ffffff",
    borderRadius: height * 0.01,
    borderWidth: 1,
    borderColor: "rgba(135,135,135, 0.35)",
    width: "90%",
    maxWidth: 600,
    alignItems: "center",
    marginTop: "5%",
  },
  form_group: {
    width: "100%",
    paddingTop: height * 0.015,
    paddingBottom: height * 0.01,
    paddingHorizontal: height * 0.03,
  },
  form_label: {
    color: "rgba(0,0,0,0.75)",
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    marginBottom: height * 0.005,
  },
  from_input: {
    borderWidth: 1,
    borderRadius: height * 0.005,
    borderColor: "#ced4da",
    color: "rgba(0,0,0,0.75)",
    paddingTop: height * 0.005,
    paddingBottom: (height * 0.0075) / 2,
    paddingLeft: (height * 0.035) / 2,
    paddingRight: (height * 0.035) / 2,
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    fontFamily: "Sukhumvit_Medium",
  },
  confirm_btn_container: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: height * 0.03,
  },
  confirm_btn: {
    marginTop: "10%",
    borderRadius: height * 0.0075,
    backgroundColor: "#b31117",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  confirm_text: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#ffffff",
    padding: height > 900 ? height * 0.005 : height * 0.0075,
  },
  image_input_container: {
    borderWidth: 1,
    borderRadius: height * 0.005,
    borderColor: "#ced4da",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: height * 0.225,
  },
  empty_image: {
    color: "rgba(0,0,0,0.5)",
  },
  modal_background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modal_container: {
    width: width * 0.65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: height * 0.015,
  },
  modal_header: {
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#000000",
    padding: width * 0.03,
    paddingTop: width * 0.045,
    paddingLeft: width * 0.15,
    paddingRight: width * 0.15,
    textAlign: "center",
  },
  modal_body: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.15)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  add_title: {
    fontFamily: "Sukhumvit_Medium",
    color: "#000000",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    padding: width * 0.025,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 500,
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: width * 0.0125,
  },
  processingContainer: {
    backgroundColor: "rgba(68,68,68,0.75)",
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    borderRadius: width * 0.0125,
  },
  processingText: {
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: -5,
  },
});
