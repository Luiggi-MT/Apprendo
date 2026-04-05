import React, { use, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../components/Header";
import { UserContext } from "../../class/context/UserContext";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { scaleFont, styles } from "../../styles/styles";
import Boton from "../../components/Boton";
import { Tarea } from "../../class/Interface/Tarea";
export default function ProfesorScreen({ navigation }: { navigation: any }) {
  const profesor = useContext(UserContext).user;
  const api = new ConnectApi();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const handleComandaPress = () => {
    navigation.navigate("ListaMenus");
  };
  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };

  const now = new Date();
  const hoy = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  console.log("Fecha de hoy:", hoy);
  const insets = useSafeAreaInsets();
  const handleMaterialPress = (tareaId: number) => {
    navigation.navigate("PedidoMaterial", {
      tareaId: tareaId,
    });
  };
  useEffect(() => {
    api
      .getTareasPeticionProfesor(profesor.id, offset, limit, hoy)
      .then((response) => {
        console.log(JSON.stringify(response.tareas, null, 2));
        setTareas(response.tareas);
      });
  }, []);
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
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
        {tareas.length > 0 && (
          <>
            {tareas.map((tarea) => (
              <Boton
                key={tarea.id}
                nameBottom={tarea.nombre.toUpperCase()}
                uri={tarea.id_pictograma}
                arasaacServiceID={true}
                onPress={() => handleMaterialPress(tarea.id)}
              />
            ))}
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}
