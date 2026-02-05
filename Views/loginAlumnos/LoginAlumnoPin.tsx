import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import {
  Image,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform, // Importante para detectar Web
} from "react-native";
import { scaleFont, styles } from "../../styles/styles";
import { BotonPin } from "../../class/Interface/BotonPin";
import BotonContraseña from "../../components/BotonContraseña";
import Boton from "../../components/Boton";
import { Speak } from "../../class/Speak/Speak";
import { useFocusEffect } from "@react-navigation/native";
import { homeScreem_styles } from "../../styles/homeScreem_styles";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";
import { Arasaac } from "../../class/Arasaac/getPictograma";

export default function LoginAlumnoPin({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;
  const speak = new Speak();
  const api = new ConnectApi();
  const arasaacService = new Arasaac();

  const windowWidth = Dimensions.get("window").width;
  const buttonWidth = Math.min(windowWidth / 3 - 25, 85);

  const opciones: BotonPin[] = [
    { id: "1", uriPictograma: "uno", nameBottom: "uno" },
    { id: "2", uriPictograma: "dos", nameBottom: "dos" },
    { id: "3", uriPictograma: "tres", nameBottom: "tres" },
    { id: "4", uriPictograma: "cuatro", nameBottom: "cuatro" },
    { id: "5", uriPictograma: "cinco", nameBottom: "cinco" },
    { id: "6", uriPictograma: "seis", nameBottom: "seis" },
    { id: "7", uriPictograma: "siete", nameBottom: "siete" },
    { id: "8", uriPictograma: "ocho", nameBottom: "ocho" },
    { id: "9", uriPictograma: "nueve", nameBottom: "nueve" },
    { id: "0", uriPictograma: "cero", nameBottom: "cero" },
  ];

  const [botonesPin] = useState<BotonPin[]>(opciones);
  const [pinValue, setPinValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [errorValue, setErrorValue] = useState<boolean>(false);
  const { setUser } = useContext(UserContext);
  const [secureText, setSecureText] = useState(true);

  const atras = () => {
    speak.detenerAsistente();
    navigation.goBack();
  };

  const handleBorrarPress = () => {
    setErrorValue(false);
    setError("");
    setPinValue("");
  };

  const handleNumberPress = (number: string) => {
    if (pinValue.length < 6) {
      setPinValue((prev) => prev + number);
    }
  };

  const handleConfirmarPress = async () => {
    setErrorValue(false);
    if (pinValue.length < 4) {
      setError("MÍNIMO 4 CARACTERES");
      setErrorValue(true);
      if (student.asistenteVoz !== "none") speak.hablar("PIN demasiado corto");
      return;
    }
    const response = await api.loginStudent(
      student.id,
      student.tipoContraseña,
      pinValue,
    );
    if (!response.ok) {
      setErrorValue(true);
      setError(response.message.toUpperCase());
      return;
    }
    await setUser(student);
    navigation.navigate(
      student.preferenciasVisualizacion === "diarias"
        ? "DiariasScreem"
        : "MensualScreen",
    );
  };

  // Definimos el contenedor dinámicamente
  const Container = Platform.OS === "web" ? ScrollView : View;

  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(30)}
      />

      <Container
        style={{ flex: 1 }}
        contentContainerStyle={
          Platform.OS === "web"
            ? { paddingHorizontal: 15, paddingBottom: 30 }
            : null
        }
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            paddingBottom: 10,
            justifyContent: "space-between",
          }}
        >
          {/* PERFIL */}
          <View
            style={[
              styles.content,
              styles.shadow,
              {
                backgroundColor: "#F5F5F5",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 20,
                marginTop: 5,
              },
            ]}
          >
            <Image
              source={{ uri: api.getFoto(student.foto) }}
              style={{
                width: 65,
                height: 65,
                borderRadius: 32.5,
                borderWidth: 2,
                borderColor: "#FF8C42",
              }}
            />
            <Text
              style={[
                homeScreem_styles.studentCardUsername,
                { marginTop: 5, fontSize: scaleFont(16) },
              ]}
            >
              {student.username.toUpperCase()}
            </Text>
          </View>

          {/* VISOR PIN */}
          <View
            style={[
              styles.buscador,
              styles.shadow,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 50,
                backgroundColor: "#FFF",
                borderRadius: 12,
                paddingRight: 15,
                marginVertical: 10,
              },
            ]}
          >
            <TextInput
              style={{
                flex: 1,
                height: "100%",
                fontSize: 22,
                textAlign: "center",
                fontFamily: "escolar-bold",
              }}
              value={pinValue}
              secureTextEntry={secureText}
              editable={false}
              placeholder="PIN"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Image
                source={{
                  uri: secureText
                    ? api.getComponent("ojo.png")
                    : arasaacService.getPictograma("ojo"),
                }}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>

          {/* TECLADO NUMÉRICO */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            <FlatList
              columnWrapperStyle={{ justifyContent: "center", gap: 10 }}
              numColumns={3}
              scrollEnabled={false}
              data={botonesPin}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ width: buttonWidth, marginVertical: 4 }}>
                  <BotonContraseña
                    uri={item.uriPictograma}
                    onPress={() => handleNumberPress(item.id)}
                  />
                </View>
              )}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            {errorValue && (
              <View style={[styles.errorContainer]}>
                <Text style={[styles.error]}>{error}</Text>
              </View>
            )}
            <View
              style={[
                styles.navigationButtons,
                { paddingHorizontal: 0, width: "100%" },
              ]}
            >
              <Boton
                uri="borrar"
                nameBottom="BORRAR"
                onPress={handleBorrarPress}
              />
              {student.asistenteVoz === "bidireccional" && (
                <Boton component={true} uri="Cohete.png" onPress={() => {}} />
              )}
              <Boton
                uri="ok"
                nameBottom="CONFIRMAR"
                onPress={handleConfirmarPress}
              />
            </View>
          </View>
        </View>
      </Container>
    </SafeAreaProvider>
  );
}
