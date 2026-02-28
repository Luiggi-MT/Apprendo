import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import Boton from "../../../../components/Boton";
import Splash from "../../../../components/Splash";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";

export default function CrearMenu({ navigation }: { navigation: any }) {
  const api = new ConnectApi();

  const atras = () => navigation.goBack();

  // Función para verificar si la tarea existe

  return (
    <SafeAreaProvider style={{ backgroundColor: "#F5F5F5" }}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="COMANDA.COMEDOR"
        uriPictograma="pollo"
        style={scaleFont(26)}
      />
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.content,
            styles.shadow,
            { margin: 15, borderRadius: 15, overflow: "hidden" },
          ]}
        >
          <Calendar
            firstDay={1}
            theme={{
              textDayFontFamily: "escolar-bold",
              textMonthFontFamily: "escolar-bold",
              textDayHeaderFontFamily: "escolar-bold",
              todayTextColor: "#4C80D7",
              arrowColor: "#FF8C42",
              monthTextColor: "#2E4053",
              textDayFontSize: scaleFont(18),
              textMonthFontSize: scaleFont(22),
            }}
            onDayPress={(day) => {
              navigation.navigate("VerComanda", { fecha: day.dateString });
            }}
            enableSwipeMonths={true}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
