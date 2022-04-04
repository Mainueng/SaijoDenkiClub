import { StyleSheet } from "react-native";

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
});
