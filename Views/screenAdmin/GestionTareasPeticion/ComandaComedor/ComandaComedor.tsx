import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CrearMenu({ navigation }: { navigation: any }) {
  const atras = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="COMANDA.COMEDOR"
        uriPictograma="pollo"
        style={scaleFont(26)}
      />
      <View style={[styles.content, styles.shadow]}>
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
            navigation.navigate("ListaMenus", {
              fecha: day.dateString,
            });
          }}
          enableSwipeMonths={true}
        />
      </View>
    </SafeAreaProvider>
  );
}
