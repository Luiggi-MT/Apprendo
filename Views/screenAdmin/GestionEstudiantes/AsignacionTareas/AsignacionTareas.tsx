import React, { useEffect, useReducer, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { Tarea } from "../../../../class/Interface/Tarea";
import None from "../../../../components/None";
import { View } from "react-native";
import Boton from "../../../../components/Boton";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import Buscador from "../../../../components/Buscador";
import TarjetaDescipcion from "../../../../components/TarjetaDescripcion";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
export default function AsignacionTareas({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [total, setTotal] = useState<number>(0);

  const { student } = route.params;

  const api = new ConnectApi();
  const arasaacService = new Arasaac();

  const handleAsignaTareaPress = (tareaId: number) => {
    navigation.navigate("AsignarTarea", {
      tareaId: tareaId,
      studentId: student.id,
    });
  };
  useEffect(() => {
    api.getTareas(offset, limit).then((response) => {
      setTareas(response.tareas);
      setOffset(response.offset);
      setTotal(response.count);
    });
  }, []);

  const atras = () => {
    navigation.goBack();
  };
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ASIGNACIÓN.DE.TAREAS"
        uriPictograma="tareasPeticion"
        style={scaleFont(22)}
      />
      {tareas.length === 0 && (
        <>
          <None description="NO HAY TAREAS CREADAS" uri="tareasPeticion" />
          <View style={{ margin: 10 }}></View>
        </>
      )}
      {tareas.length > 0 && (
        <>
          <Buscador nameBuscador="BUSCAR TAREA" onPress={() => {}} />
          <View style={[styles.content, styles.shadow]}>
            {tareas.map((tarea) => (
              <TarjetaDescipcion
                key={tarea.id}
                uri={arasaacService.getPictogramaId(tarea.id_pictograma)}
                description="ASIGNAR.TAREA"
                name={tarea.nombre.toUpperCase()}
                navigation={() => handleAsignaTareaPress(tarea.id)}
              />
            ))}
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
}
