import React, { useContext, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { scaleFont, styles } from "../../styles/styles";
import { View, FlatList, Dimensions } from "react-native";
import Boton from "../../components/Boton";
import { BotonHomeAdmin } from "../../class/Interface/BotonHomeAdmin";
import { UserContext } from "../../class/context/UserContext";

export default function AdminScreen({ navigation }: { navigation: any }) {
  const windowWidth = Dimensions.get("window").width;
  const buttonWidth = windowWidth / 2 - 15;
  const opciones: BotonHomeAdmin[] = [
    {
      id: "1",
      uriPictograma: "estudiante",
      nameBottom: "GESTIÓN.DE.ESTUDIANTES",
      navigation: "GestionEstudiantes",
    },
    {
      id: "2",
      uriPictograma: "profesor",
      nameBottom: "GESTIÓN.DE.PROFESORES",
      navigation: "GestionProfesores",
    },
    {
      id: "3",
      uriPictograma: "tareasPeticion",
      nameBottom: "GESTIÓN DE.TAREAS.DE PETICIÓN",
      navigation: "TareaPeticion",
    },
    {
      id: "4",
      uriPictograma: "chat",
      nameBottom: " .CHAT. ",
      navigation: "Chat",
    },
    {
      id: "5",
      uriPictograma: "tareasPorPasos",
      nameBottom: "GESTIÓN DE.TAREAS.POR PASOS",
      navigation: "TareasPorPasos",
    },
  ];
  const [menuOpciones, setMenuOpciones] = useState<BotonHomeAdmin[]>(opciones);
  const profesor = useContext(UserContext).user;
  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri={profesor.foto}
        nameBottom="PERFIL"
        navigation={() => perfil()}
        nameHeader="PÁGINA.PRINCIPAL"
        uriPictograma="paginaPrincipal"
        arasaacService={false}
        style={scaleFont(25)}
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
