import React, { useContext, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { UserContext } from "../../class/context/UserContext";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { scaleFont, styles } from "../../styles/styles";
import Boton from "../../components/Boton";
export default function ProfesorScreen({ navigation }: { navigation: any }) {
  const profesor = useContext(UserContext).user;
  const api = new ConnectApi();
  const [peticion, setPeticion] = useState<boolean>(false);
  const handleComandaPress = () => {
    navigation.navigate("ListaMenus");
  };
  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };
  return (
    <SafeAreaProvider>
      <Header
        uri={profesor.foto}
        nameBottom="PERFIL"
        navigation={perfil}
        nameHeader="PÁGINA.PRINCIPAL"
        uriPictograma="paginaPrincipal"
        arasaacService={false}
        style={scaleFont(25)}
      />
      <View style={[styles.content, styles.shadow]}>
        <Boton nameBottom="COMANDA" uri="pollo" onPress={handleComandaPress} />
        {peticion === true && (
          <Boton
            nameBottom="MATERIAL.ESCOLAR"
            uri="materialEscolar"
            onPress={() => {
              navigation.navigate("GestionAulas");
            }}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}
