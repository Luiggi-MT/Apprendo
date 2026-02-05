import React, { useContext } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { UserContext } from "../../class/context/UserContext";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { scaleFont } from "../../styles/styles";
export default function ProfesorScreen({ navigation }: { navigation: any }) {
  const profesor = useContext(UserContext).user;
  const api = new ConnectApi();
  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };
  return (
    <SafeAreaProvider>
      <Header
        uri={profesor.foto}
        nameBottom="PERFIL"
        navigation={perfil}
        nameHeader="Página.Principal"
        uriPictograma="paginaPrincipal"
        arasaacService={false}
        style={scaleFont(25)}
      />
    </SafeAreaProvider>
  );
}
