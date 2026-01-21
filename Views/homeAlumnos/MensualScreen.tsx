import React, { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Header from "../../components/Header";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";
import { scaleFont, styles } from "../../styles/styles";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { View } from "react-native";

export default function MensualScreen({ navigation }: { navigation: any }) {
  const student: Students = useContext(UserContext).user as Students;

  const semanales: boolean = true;

  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };
  return (
    <SafeAreaProvider>
      <Header
        uri={student.foto}
        nameBottom="PERFIL"
        navigation={perfil}
        nameHeader="LISTA.DE.TAREAS"
        uriPictograma="lista"
        arasaacService={false}
        style={scaleFont(25)}
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
            navigation.navigate("DiariasScreem", {
              fecha: day.dateString,
              semanales,
            });
          }}
          enableSwipeMonths={true}
        />
      </View>
    </SafeAreaProvider>
  );
}
