import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { UserContext } from "../../class/context/UserContext";
import { scaleFont, styles } from "../../styles/styles";
import { Text, View, Image } from "react-native";
import { Arasaac } from "../../class/Arasaac/getPictograma";
import { Students } from "../../class/Interface/Students";
import { Speak } from "../../class/Speak/Speak";

export default function DiariasScreem({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const student: Students = useContext(UserContext).user as Students;
  const esSemanales = route?.params?.semanales || false;
  const fechaSeleccionada = route?.params?.fecha
    ? route.params.fecha
    : new Date().toISOString().split("T")[0];
  const arassacService = new Arasaac();
  const speak = new Speak();

  const [tareas, setTareas] = useState([]);

  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };

  const atras = () => {
    navigation.goBack();
  };
  console.log(JSON.stringify(fechaSeleccionada, null, 2));
  useEffect(() => {
    if (student.asistenteVoz !== "none") {
      if (tareas.length === 0) {
        speak.hablar(`Genial, no tienes tareas pendietes`);
      }
    }
  }, [student]);
  return (
    <SafeAreaProvider>
      {esSemanales ? (
        <Header
          uri="volver"
          nameBottom="ATRÁS"
          navigation={atras}
          nameHeader="ENTRAR"
          uriPictograma="entrar"
          style={scaleFont(36)}
        />
      ) : (
        <Header
          uri={student.foto}
          nameBottom="PERFIL"
          navigation={perfil}
          nameHeader="LISTA.DE.TAREAS"
          uriPictograma="lista"
          arasaacService={false}
          style={scaleFont(25)}
        />
      )}

      <View style={[styles.content, styles.shadow]}>
        {tareas.length === 0 ? (
          <View style={styles.containerRefuerzoPositivo}>
            <Text style={styles.tituloExitoso}>
              ¡GENIAL, NO HAY TAREAS PENDIENTES!
            </Text>
            <Image
              source={{ uri: arassacService.getPictograma("ok") }}
              style={styles.image}
            />
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </SafeAreaProvider>
  );
}
