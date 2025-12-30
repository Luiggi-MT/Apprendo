import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
export default function LoginAlumnoPin({ navigation }: { navigation: any }) {
  const atras = () => {
    navigation.goBack();
  };
  const api = new ConnectApi();
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="Atrás"
        navigation={() => atras()}
        nameHeader={api.getComponent("Entrar.png")}
        uriPictograma="entrar"
      />
    </SafeAreaProvider>
  );
}
