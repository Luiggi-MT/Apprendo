import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import Boton from "../../../../components/Boton";
import Splash from "../../../../components/Splash";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { UserContext } from "../../../../class/context/UserContext";

export default function CrearMenu({ navigation }: { navigation: any }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [esCreada, setEsCreada] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState<boolean>(false);
  const [mensajeValue, setMensajeValue] = useState<string>("");

  const user = useContext(UserContext).user;
  const uriCoamanda = 4952;
  const api = new ConnectApi();

  const atras = () => navigation.goBack();

  // Función para verificar si la tarea existe
  const checkTarea = async () => {
    const response = await api.getTareaComanda();
    setEsCreada(response);
  };

  useEffect(() => {
    checkTarea();
  }, [isLoading]);

  const handleCrearTareaPress = async () => {
    setMensaje(false);
    setIsLoading(true);
    setError(false);

    const response = await api.createTareaComanda(
      uriCoamanda,
      "COMANDA",
      user.id,
    );

    setTimeout(() => {
      setIsLoading(false);
      if (!response) {
        setError(true);
        setMensajeValue("NO SE HA PODIDO CREAR LA TAREA");
      } else {
        setMensaje(true);
        setMensajeValue("LA TAREA SE HA CREA_DO EXITOSAMENTE");
        setTimeout(() => setMensaje(false), 2000);
      }
    }, 1500);
  };

  const handleEliminarTareaPress = async () => {
    setConfirmarBorrado(false);
    setIsLoading(true);
    setError(false);

    const response = await api.deleteTareaComanda();

    setTimeout(() => {
      setIsLoading(false);
      if (!response) {
        setError(true);
        setMensajeValue("NO SE HA PODIDO ELIMINAR LA TAREA");
      } else {
        setMensaje(true);
        setMensajeValue("LA TAREA SE HA ELIMINA_DO EXITOSAMENTE");
        setTimeout(() => setMensaje(false), 2000);
      }
    }, 1500);
  };

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

      {isLoading ? (
        <Splash
          name={confirmarBorrado ? "ELIMINANDO TAREA" : "CREANDO TAREA"}
        />
      ) : (
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
                navigation.navigate("ListaMenus", { fecha: day.dateString });
              }}
              enableSwipeMonths={true}
            />
          </View>

          {mensaje && (
            <Text
              style={[
                styles.text_legend,
                {
                  textAlign: "center",
                  color: "green",
                  fontSize: scaleFont(20),
                },
              ]}
            >
              {mensajeValue}
            </Text>
          )}

          {error && (
            <Text
              style={[
                styles.error,
                { textAlign: "center", fontSize: scaleFont(20) },
              ]}
            >
              {mensajeValue}
            </Text>
          )}

          <View style={{ padding: 20 }}>
            {confirmarBorrado ? (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    styles.error,
                    { marginBottom: 20, fontSize: scaleFont(22) },
                  ]}
                >
                  ¿SEGURO QUE QUIERES BORRAR LA TAREA?
                </Text>
                <View style={styles.navigationButtons}>
                  <Boton
                    uri="x"
                    nameBottom="NO ELIMINAR"
                    onPress={() => setConfirmarBorrado(false)}
                  />
                  <Boton
                    uri="ok"
                    nameBottom="SI, ELIMINAR"
                    onPress={handleEliminarTareaPress}
                  />
                </View>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                {!esCreada ? (
                  <Boton
                    uri="tareasPeticion"
                    nameBottom="CREAR.TAREA"
                    onPress={handleCrearTareaPress}
                  />
                ) : (
                  <Boton
                    uri="tareasPeticion"
                    nameBottom="ELIMINAR.TAREA"
                    onPress={() => setConfirmarBorrado(true)}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
}
