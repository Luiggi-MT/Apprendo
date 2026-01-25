import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Dimensions, FlatList, View } from "react-native";
import { scaleFont, styles } from "../../../styles/styles";
import { BotonHomeAdmin } from "../../../class/Interface/BotonHomeAdmin";

import Header from "../../../components/Header";
import Boton from "../../../components/Boton";

export default function TareaPeticion({ navigation }: { navigation: any }) {
  const windowWidth = Dimensions.get("window").width;
  const buttonWidth = windowWidth / 2 - 15;
  const opciones: BotonHomeAdmin[] = [
    {
      id: "1",
      uriPictograma: "pollo",
      nameBottom: "COMANDA.COMEDOR",
      navigation: "ComandaComedor",
    },
    {
      id: "2",
      uriPictograma: "materialEscolar",
      nameBottom: "MATERIALES.ESCOLARES",
      navigation: "MaterialEscolar",
    },
    {
      id: "3",
      uriPictograma: "impresora",
      nameBottom: "FOTOCOPIADORA",
      navigation: "Impresora",
    },
  ];
  const [menuOpciones, setMenuOpciones] = useState<BotonHomeAdmin[]>(opciones);

  const atras = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="GESTIÓN.DE TAREAS. DE PETICIÓN"
        uriPictograma="tareasPeticion"
        style={scaleFont(20)}
      />
      <View style={[styles.content, styles.shadow]}>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
          }}
          data={menuOpciones}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: buttonWidth }}>
              <View style={{ margin: 10 }}>
                <Boton
                  uri={item.uriPictograma}
                  nameBottom={item.nameBottom}
                  onPress={() => navigation.navigate(item.navigation)}
                />
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaProvider>
  );
}
