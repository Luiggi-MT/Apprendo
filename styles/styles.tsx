import { StyleSheet, Platform } from "react-native";

export const gradientColors = ["#4C80D7", "#42C9A6", "#FDD050"];

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  android: {
    elevation: 10,
  },
  web: {
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  },
});

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9E9E9",
    flex: 1,
  },

  header: {
    height: 200,
    width: "100%",
    backgroundColor: "#2E4053",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
  },

  titleHeaderContainer: {
    alignItems: "center",
  },

  shadow: {
    ...shadowStyle,
  },

  image: {
    padding: 2,
    width: 100,
    height: 100,
  },

  legendBoton: {
    borderWidth: 1,
    backgroundColor: "#FF8C42",
    width: 120,
    borderRadius: 5,
    marginLeft: 10,
  },

  textBoton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    margin: 2,
  },

  buscador: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },

  content: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 10,
  },

  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 5,
  },
  studentCard: {
    borderWidth: 1,
    borderRadius: 5,
  },
  studentCardUsername: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  studentItem: {
    flex: 1,
    alignItems: "center",
    margin: 2,
  },

  error: {
    color: "tomato",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  tarjet: {
    marginBottom: 3,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageTarjet: {
    padding: 2,
    width: 80,
    height: 80,
  },

  radius: {
    borderWidth: 1,
    borderRadius: 50,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  asistente: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: gradientColors[1],
  },
  buttonActive: {},
  buttonDissable: {},
});
