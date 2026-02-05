import { StyleSheet, Platform } from "react-native";
import { scaleFont } from "./styles";

export const homeScreem_styles = StyleSheet.create({

  studentItem: {              
    alignItems: "center",
    margin: 8,               
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: "#F9F9F9",
    borderRadius: 15,        
  
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  
  studentCard: {
    width: 85,               
    height: 85,
    borderRadius: 42.5,      
    borderWidth: 2,
    borderColor: "#FF8C42",  
    marginBottom: 10,
  },

  studentCardUsername: {
    fontSize: scaleFont(14), 
    fontFamily: "escolar-bold",
    textAlign: "center",
    color: "#333",
    textTransform: "uppercase",
  },


  columnWrapper: {
    justifyContent: "space-around", 
    paddingHorizontal: 10,
  },
});