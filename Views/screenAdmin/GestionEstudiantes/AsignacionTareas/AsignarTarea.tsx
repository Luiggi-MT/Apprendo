import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { Calendar } from "react-native-calendars";
import { View, Text } from "react-native";
import Boton from "../../../../components/Boton";
import Splash from "../../../../components/Splash";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";

export default function AsignarTarea({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { tareaId, studentId } = route.params;
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isLoaging, setIsLoading] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<string>("");

  const api = new ConnectApi();

  // Función para calcular y colorear todos los días del rango
  const getPeriodoMarcado = () => {
    if (!fechaInicio) return {};

    let marcado: any = {};

    if (fechaInicio && !fechaFin) {
      marcado[fechaInicio] = {
        selected: true,
        startingDay: true,
        endingDay: true,
        color: "#4C80D7",
        textColor: "white",
      };
      return marcado;
    }

    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    let current = new Date(start);

    while (current <= end) {
      const dateString = current.toISOString().split("T")[0];

      marcado[dateString] = {
        selected: true,
        color: "#4C80D7",
        textColor: "white",
        startingDay: dateString === fechaInicio,
        endingDay: dateString === fechaFin,
      };
      current.setDate(current.getDate() + 1);
    }

    return marcado;
  };

  const handleDayPress = (day: any) => {
    if (!fechaInicio || (fechaInicio && fechaFin)) {
      setFechaInicio(day.dateString);
      setFechaFin("");
    } else if (day.dateString > fechaInicio) {
      setFechaFin(day.dateString);
    } else {
      // Si selecciona una fecha anterior a la de inicio, reiniciamos el rango
      setFechaInicio(day.dateString);
      setFechaFin("");
    }
  };

  const handleAsignarPress = () => {
    setError(false);
    setErrorValue("");
    if (!fechaInicio || !fechaFin) {
      setError(true);
      setErrorValue("DEBES SELECCIONAR UN RANGO DE FECHAS");
      return;
    }
    const hoy = new Date().toISOString().split("T")[0];
    if (fechaInicio < hoy) {
      setError(true);
      setErrorValue("LA FECHA DE INICIO NO PUEDE SER ANTERIOR A HOY");
      return;
    }
    setIsLoading(true);
    api
      .asignarTarea(tareaId, studentId, fechaInicio, fechaFin)
      .then((respose) => {
        if (!respose) {
          setError(true);
          setErrorValue("NO SE HA PODIDO ASIGNAR LA TAREA");
          return;
        }
        setTimeout(() => {
          setIsLoading(false);
          navigation.goBack();
        }, 2000);
      });
  };

  const atras = () => navigation.goBack();

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ASIGNAR.TAREA"
        uriPictograma="tareasPeticion"
        style={scaleFont(30)}
      />
      {isLoaging && <Splash name="ASIGNANDO TAREA" />}
      {!isLoaging && (
        <>
          <View style={[styles.shadow, styles.content]}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: scaleFont(18),
                  marginBottom: 20,
                  textAlign: "center",
                  paddingHorizontal: 10,
                },
              ]}
            >
              SELECCIONA LA FECHA DE INICIO Y LA DE FINALIZACIÓN:
            </Text>

            <Calendar
              firstDay={1}
              markingType={"period"}
              markedDates={getPeriodoMarcado()}
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
              onDayPress={handleDayPress}
              enableSwipeMonths={true}
            />
          </View>
          {error && (
            <View>
              <Text style={[styles.error]}>{errorValue}</Text>
            </View>
          )}
          <View style={{ marginBottom: 20 }}>
            <Boton
              nameBottom="ASIGNAR.TAREA"
              uri="ok"
              onPress={handleAsignarPress}
            />
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
}
