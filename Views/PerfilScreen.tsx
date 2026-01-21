import React, { useContext, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { View } from "react-native";
import { scaleFont, styles } from "../styles/styles";
import Boton from "../components/Boton";
import { UserContext } from "../class/context/UserContext";
export default function PerfilScreen({ navigation }: { navigation: any }) {
  const user = useContext(UserContext).user;

  const atras = () => {
    navigation.goBack();
  };
  const salir = () => {
    const respose = api.logoutUser();
    if (respose) navigation.navigate("Home");
  };
  const api = new ConnectApi();
  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={() => atras()}
        nameHeader="PERFIL"
        uriPictograma="perfil"
        style={scaleFont(36)}
      />
      <View style={[styles.content, styles.shadow]}>
        <Boton
          uri={user.foto}
          nameBottom="CAMBIAR FOTO.DE PERFIL"
          arasaacService={false}
          onPress={() => {}}
        />
        <Boton
          uri="olvideContraseña"
          nameBottom="CAMBIAR.CONTRASEÑA"
          onPress={() => {}}
        />
        <Boton uri="salir" nameBottom="SALIR" onPress={() => salir()} />
      </View>
    </SafeAreaProvider>
  );
}
