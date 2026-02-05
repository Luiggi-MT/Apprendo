import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { Image, Text, View } from "react-native";
import Buscador from "../../../components/Buscador";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
import TarjetaDescipcion from "../../../components/TarjetaDescripcion";
import { ActivityIndicator } from "react-native-paper";
function NoneProfesor() {
  const arassacService = new Arasaac();
  return (
    <View style={[styles.content, styles.shadow, { alignItems: "center" }]}>
      <Text style={styles.text}>NO SE HAN ENCONTRADO ESTUDIANTES</Text>
      <View style={styles.superPuesto}>
        <Image
          source={{ uri: arassacService.getPictograma("estudiante") }}
          style={styles.imageBase}
        />
        <Image
          source={{ uri: arassacService.getPictograma("fallo") }}
          style={styles.imageOverlay}
        />
      </View>
    </View>
  );
}
function SplashScreen() {
  return (
    <View style={[styles.content, styles.shadow]}>
      <ActivityIndicator size="large" color="#FF8C42" />
      <Text
        style={[
          styles.text_legend,
          {
            textAlign: "center",
            marginTop: 20,
            fontSize: scaleFont(18),
            fontWeight: "bold",
            color: "#333",
          },
        ]}
      >
        ASIGNANDO AULA...
      </Text>
      <Text
        style={[
          styles.text,
          { fontSize: scaleFont(15), marginTop: 10, color: "#666" },
        ]}
      >
        POR FAVOR, ESPERE UN MOMENTO.
      </Text>
    </View>
  );
}
export default function AsignarProfesorAula({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [profesor, setProfesor] = useState<any>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<string>("");

  const { aulaId } = route.params;
  const api = new ConnectApi();
  const atras = () => {
    navigation.goBack();
  };
  const handleSeleccionarPress = async (profesorId: number) => {
    setIsLoading(true);
    const response = await api.asignarProfesorAula(profesorId, aulaId);
    if (!response) {
      setError(true);
      setErrorValue("ERROR AL ASIGNAR EL PROFESOR AL AULA");
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 1000);
  };
  useEffect(() => {
    api.getProfesores(offset, limit).then((response) => {
      setProfesor(response.profesores);
      setOffset(response.offset);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ASIGNAR.PROFESOR"
        uriPictograma="aula"
        style={scaleFont(26)}
      />
      {isLoading && <SplashScreen />}

      {!isLoading && profesor.length === 0 && <NoneProfesor />}
      {!isLoading && profesor.length > 0 && (
        <View>
          <Buscador nameBuscador="BUSCAR.PROFESOR" onPress={() => {}} />
          <View style={[styles.content, styles.shadow]}>
            {profesor.map((profesorItem: any) => (
              <TarjetaDescipcion
                key={profesorItem.id.toString()}
                name={profesorItem.username}
                uri={api.getFoto(profesorItem.foto)}
                navigation={() => handleSeleccionarPress(profesorItem.id)}
                description="SELECCIONAR.PROFESOR"
                style={{ margin: 10 }}
              />
            ))}
          </View>
        </View>
      )}
      {error && (
        <View>
          <Text style={[styles.error]}>{errorValue}</Text>
        </View>
      )}
    </SafeAreaProvider>
  );
}
