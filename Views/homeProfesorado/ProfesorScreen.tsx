import React, { useContext } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { UserContext } from "../../class/context/UserContext";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
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
        nameBottom="Perfil"
        navigation={() => perfil()}
        nameHeader={api.getComponent("PaginaPrincipal.png")}
        uriPictograma="paginaPrincipal"
        arasaacService={false}
      />
    </SafeAreaProvider>
  );
}
