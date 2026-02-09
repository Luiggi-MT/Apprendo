import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { scaleFont, styles } from "../../styles/styles";
import Boton from "../../components/Boton";
import Header from "../../components/Header";
import { Speak } from "../../class/Speak/Speak";
import { homeScreem_styles } from "../../styles/homeScreem_styles";
import { UserContext } from "../../class/context/UserContext";
import { Arasaac } from "../../class/Arasaac/getPictograma";

export default function LoginAlumnoAlfanumerica({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;
  const api = new ConnectApi();
  //const speak = new Speak();
  const arasaacService = new Arasaac();

  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const { setUser } = useContext(UserContext);
  const [errorValue, setErrorValue] = useState<boolean>(false);
  const [secureText, setSecureText] = useState(true);

  const handleBorrarPress = () => {
    setPassword("");
    setErrorValue(false);
  };
  const atras = () => {
    //speak.detenerAsistente();
    navigation.goBack();
  };

  const activarAsistente = () => {
    // Implementar lógica del asistente si es necesario
  };

  const handleConfirmarPress = async () => {
    setErrorValue(false);
    if (password === "") {
      setErrorValue(true);
      setError(["CAMPO VACÍO"]);
      return;
    }
    const response = await api.loginStudent(
      student.id,
      student.tipoContraseña,
      password,
    );
    if (!response.ok) {
      setErrorValue(true);
      setError([response.message.toUpperCase()]);
      return;
    }
    await setUser(student);
    navigation.navigate(
      student.preferenciasVisualizacion === "diarias"
        ? "DiariasScreem"
        : "MensualScreen",
    );
  };

  useEffect(() => {
    if (student.asistenteVoz !== "none") {
      //speak.hablar(
      //  `Hola ${student.username}. Introduce tu contraseña y a continuación presiona continuar`,
      //);
    }
  }, []);
  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(28)}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: "space-evenly",
          paddingBottom: 10,
        }}
      >
        <View
          style={[
            styles.content,
            styles.shadow,
            {
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              paddingVertical: 15,
              borderRadius: 20,
              marginVertical: 5,
            },
          ]}
        >
          <Image
            source={{ uri: api.getFoto(student.foto) }}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              borderWidth: 2,
              borderColor: "#FF8C42",
            }}
          />
          <Text
            style={[
              homeScreem_styles.studentCardUsername,
              { marginTop: 5, fontSize: scaleFont(18) },
            ]}
          >
            {student.username.toUpperCase()}
          </Text>
        </View>

        <View>
          <Text
            style={[
              styles.text_legend,
              { marginBottom: 5, textAlign: "center" },
            ]}
          >
            CONTRASEÑA:
          </Text>
          <View
            style={[
              styles.buscador,
              styles.shadow,
              {
                flexDirection: "row",
                alignItems: "center",
                height: 55,
                backgroundColor: "#FFF",
                borderRadius: 12,
                paddingRight: 15,
                margin: 0,
              },
            ]}
          >
            <TextInput
              style={{
                flex: 1,
                height: "100%",
                fontSize: 20,
                paddingLeft: 15,
                fontFamily: "escolar-bold",
              }}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={secureText}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              {secureText && (
                <Image
                  source={{ uri: api.getComponent("ojo.png") }}
                  style={{ width: 35, height: 35 }}
                />
              )}
              {!secureText && (
                <Image
                  source={{ uri: arasaacService.getPictograma("ojo") }}
                  style={{ width: 35, height: 35 }}
                />
              )}
            </TouchableOpacity>
          </View>
          {errorValue && (
            <View style={[styles.errorContainer]}>
              <Text style={[styles.error]}>{error}</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.navigationButtons,
            { paddingHorizontal: 0, marginVertical: 5 },
          ]}
        >
          <Boton uri="borrar" nameBottom="BORRAR" onPress={handleBorrarPress} />
          <Boton
            uri="ok"
            nameBottom="CONFIRMAR"
            onPress={handleConfirmarPress}
          />
        </View>

        {student.asistenteVoz === "bidireccional" && (
          <View style={{ alignItems: "center" }}>
            <Boton
              component={true}
              uri="Cohete.png"
              onPress={activarAsistente}
            />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}
