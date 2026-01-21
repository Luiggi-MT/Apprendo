import { StyleSheet } from "react-native";
import { scaleFont } from "./styles";

export const homeScreem_styles = StyleSheet.create({
  studentCard: {
    borderWidth: 1,
    borderRadius: 5,
    width: 100, 
    height: 100,
    margin: 10,
  },
  studentItem: {
    alignItems: "center",
    margin: 10,
    width: 100,
  },
  studentCardUsername: {
    fontSize: scaleFont(16),
    fontFamily: "escolar-bold",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "center",
  },
})