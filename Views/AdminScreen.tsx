import React, { useContext, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import { styles } from "../styles/styles";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { Profesor } from "../class/Interface/Profesor";
import { View, FlatList, Dimensions } from "react-native";
import Boton from "../components/Boton";
import { BotonHomeAdmin } from "../class/Interface/BotonHomeAdmin";
import { UserContext } from "../class/context/UserContext";

export default function AdminScreen({ navigation }: { navigation: any }) {
  const windowWidth = Dimensions.get("window").width;
  const buttonWidth = windowWidth / 2 - 15;
  const opciones: BotonHomeAdmin[] = [
    {
      id: "1",
      uriPictograma: "estudiante",
      nameBottom: "Gestión de estudiantes",
      navigation: "GestionEstudiantes",
    },
    {
      id: "2",
      uriPictograma: "profesor",
      nameBottom: "Gestión de profesores",
      navigation: "GestionProfesores",
    },
    {
      id: "3",
      uriPictograma: "tareasPeticion",
      nameBottom: "Gestión de tareas de petición",
      navigation: "TareaPeticion",
    },
    {
      id: "4",
      uriPictograma: "chat",
      nameBottom: "Chats",
      navigation: "Chat",
    },
    {
      id: "5",
      uriPictograma: "tareasPorPasos",
      nameBottom: "Gestion de tareas por pasos",
      navigation: "TareasPorPasos",
    },
  ];
  const [menuOpciones, setMenuOpciones] = useState<BotonHomeAdmin[]>(opciones);
  const profesor = useContext(UserContext).user;
  const api = new ConnectApi();
  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri={profesor.foto}
        nameBottom="Perfil"
        navigation={() => perfil()}
        nameHeader={api.getComponent("PaginaPrincipal.png")}
        uriPictograma="paginaPrincipal"
        arasaacService={false}
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
              <Boton
                uri={item.uriPictograma}
                nameBottom={item.nameBottom}
                onPress={() => navigation.navigate(item.navigation)}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaProvider>
  );
}
