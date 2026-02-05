import React, { useContext, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import Header from "../components/Header";
import { scaleFont, styles } from "../styles/styles";
import InputText from "../components/InputText";
import Boton from "../components/Boton";
import { LoginResponse } from "../class/Interface/LoginResponse";
import { Profesor } from "../class/Interface/Profesor";
import { UserContext } from "../class/context/UserContext";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function Profesorado({ navigation }: { navigation: any }) {
  const [usuario, setUsuario] = useState("");
  const { setUser } = useContext(UserContext);
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [secureText, setSecureText] = useState(true);

  const api = new ConnectApi();
  const arasaacService = new Arasaac();

  const atras = () => navigation.goBack();

  const onBorrarPress = () => {
    setUsuario("");
    setContraseña("");
    setError("");
  };

  const onEnviarPress = async () => {
    if (contraseña.length < 4) {
      setError("LA CONTRASEÑA DEBE TENER AL MENOS 4 CARACTERES");
      return;
    }
    const response: LoginResponse = await api.loginUser(usuario, contraseña);
    if (!response.ok) {
      setError(response.message.toUpperCase());
      return;
    }
    const profesor: Profesor = {
      foto: response.foto,
      username: response.username,
      tipo: response.tipo,
      id: response.id,
    };
    await setUser(profesor);
    navigation.navigate(
      profesor.tipo === "admin" ? "AdminScreen" : "ProfesorScreen",
    );
  };

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

      <View
        style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center" }}
      >
        <View
          style={[
            styles.content,
            styles.shadow,
            {
              backgroundColor: "#F5F5F5",
              paddingVertical: 25,
              borderRadius: 20,
            },
          ]}
        >
          <InputText nameInput="USUARIO:" input={setUsuario} value={usuario} />

          <Text style={[styles.text_legend, { marginTop: 15 }]}>
            CONTRASEÑA:
          </Text>
          <View
            style={[
              styles.buscador,
              styles.shadow,
              {
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFF",
                height: 55,
                borderRadius: 12,
                paddingRight: 10,
                margin: 0,
              },
            ]}
          >
            <TextInput
              style={{
                flex: 1,
                height: "100%",
                fontSize: 18,
                paddingLeft: 15,
                fontFamily: "escolar-bold",
                color: "#000",
              }}
              onChangeText={setContraseña}
              value={contraseña}
              secureTextEntry={secureText}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={{ padding: 5 }}
            >
              <Image
                source={{
                  uri: secureText
                    ? api.getComponent("ojo.png")
                    : arasaacService.getPictograma("ojo"),
                }}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("OlvideContraseña")}
            style={{ marginTop: 15, alignSelf: "center", padding: 10 }}
          >
            <Text
              style={{
                color: "#4C80D7",
                fontFamily: "escolar-bold",
                textDecorationLine: "underline",
              }}
            >
              ¿OLVIDASTE TU CONTRASEÑA?
            </Text>
          </TouchableOpacity>

          {!!error && (
            <View style={[styles.errorContainer]}>
              <Text style={[styles.error]}>{error}</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.navigationButtons,
            { paddingHorizontal: 0, marginTop: 25 },
          ]}
        >
          <Boton uri="borrar" nameBottom="BORRAR" onPress={onBorrarPress} />
          <Boton uri="ok" nameBottom="ENVIAR" onPress={onEnviarPress} />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
