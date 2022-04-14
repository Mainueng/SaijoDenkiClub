import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../../components/font";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e6e6e6",
  },
  profile_image_container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  profile_image: {
    width: height * 0.09 > 110 ? 110 : height * 0.09,
    height: height * 0.09 > 110 ? 110 : height * 0.09,
    borderRadius: (height * 0.18) / 2,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#b31117",
  },
  edit_icon: {
    position: "absolute",
    backgroundColor: "#b31117",
    padding: "1.25%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width,
    right: 0,
    bottom: 0,
  },
  profile_card: {
    borderRadius: height * 0.01,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(135,135,135, 0.35)",
    marginTop: "2.5%",
    padding: "4%",
  },
  profile_name: {
    color: "#000000",
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(16) > 20 ? 20 : normalize(16),
    marginTop: height * 0.015,
  },
  edit: {
    color: "#b31117",
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
  },
  card_top: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  card_bottom: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  card_left: {
    flex: 1,
    justifyContent: "center",
  },
  card_center: {
    flex: 9,
    justifyContent: "center",
  },
  card_right: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  card_label: {
    color: "#000000",
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
  },
  edit_text: {
    color: "#b31117",
    fontFamily: "Sukhumvit_SemiBold",
    fontSize: normalize(12) > 16 ? 16 : normalize(12),
  },
  card_phone: {
    color: "rgba(0,0,0,0.5)",
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
  },
  card_address: {
    color: "rgba(0,0,0,0.5)",
    fontFamily: "Sukhumvit_Medium",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
    lineHeight: 24,
  },
  card_map: {
    height: height * 0.2,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  close_modal_btn: {
    marginBottom: height * 0.03,
  },
  close_modal_image: {
    height: height * 0.03,
    shadowColor: "#000000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sign_out: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "8%",
  },
  sign_out_text: {
    fontFamily: "Sukhumvit_SemiBold",
    color: "rgba(0,0,0,0.35)",
    fontSize: normalize(14) > 18 ? 18 : normalize(14),
  },
});
