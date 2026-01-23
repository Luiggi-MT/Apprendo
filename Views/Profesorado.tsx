import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import Header from "../components/Header";
import { scaleFont, styles } from "../styles/styles";
import { View, Text } from "react-native";
import InputText from "../components/InputText";
import Boton from "../components/Boton";
import { LoginResponse } from "../class/Interface/LoginResponse";
import { Profesor } from "../class/Interface/Profesor";
import { UserContext } from "../class/context/UserContext";

export default function Profesorado({ navigation }: { navigation: any }) {
  const [usuario, setUsuario] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const api = new ConnectApi();
  const atras = () => {
    navigation.goBack();
  };
  const handleUsuarioPress = (inputUsuario: string) => {
    setUsuario(inputUsuario);
  };
  const handleContraseñaPress = (inputContraseña: string) => {
    setContraseña(inputContraseña);
  };
  const onBorrarPress = () => {
    setUsuario("");
    setContraseña("");
    setError("");
  };
  const onEnviarPress = async () => {
    if (contraseña.length < 4) {
      setError("LA CONTRASEÑA TIENE QUE TENER COMO MÍNIMO 4 CARÁCTERES");
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
    };
    await setUser(profesor);
    if (profesor.tipo === "admin") navigation.navigate("AdminScreen");
    if (profesor.tipo === "profesor") navigation.navigate("ProfesorScreen");
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(36)}
      />
      <View
        style={[styles.content, styles.shadow, { justifyContent: "center" }]}
      >
        <InputText
          nameInput="USUARIO:"
          input={handleUsuarioPress}
          value={usuario}
        />
        <InputText
          nameInput="CONTRASEÑA:"
          input={handleContraseñaPress}
          secure={true}
          value={contraseña}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Boton
            uri="olvideContraseña"
            nameBottom="OLVIDE.MI.CONTRASEÑA"
            onPress={() => {}}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 10,
        }}
      >
        <Boton uri="borrar" nameBottom="BORRAR" onPress={onBorrarPress} />
        <Boton uri="ok" nameBottom="ENVIAR" onPress={onEnviarPress} />
      </View>
    </SafeAreaProvider>
  );
}
