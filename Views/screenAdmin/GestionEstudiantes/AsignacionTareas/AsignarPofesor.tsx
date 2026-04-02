import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scaleFont, styles } from "../../../../styles/styles";
import Header from "../../../../components/Header";
import { Profesor } from "../../../../class/Interface/Profesor";
import None from "../../../../components/None";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import Buscador from "../../../../components/Buscador";
import TarjetaDescipcion from "../../../../components/TarjetaDescripcion";

const AsignarPofesor = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [profesor, setProfesor] = useState<Profesor[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [total, setTotal] = useState<number>(0);
  const api = new ConnectApi();
  const insets = useSafeAreaInsets();
  const atras = () => navigation.goBack();
  const handleAsignarPress = (id: number) => {
    const { onSelectProfesor } = route.params;
    if (onSelectProfesor) onSelectProfesor(id);
    navigation.goBack();
  };
  useEffect(() => {
    api.getProfesores(offset, limit).then((response) => {
      setOffset(response.offset);
      setTotal(response.total);
      setProfesor(response.profesores);
    });
  }, []);
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ASIGNAR.PROFESOR"
        uriPictograma="profesor"
        style={scaleFont(20)}
      />
      {profesor.length === 0 && (
        <None description="NO SE HAN ENCONTRADO PROFESORES" uri="profesor" />
      )}
      {profesor.length > 0 && (
        <View>
          <Buscador nameBuscador="BUSCAR PROFESOR" onPress={() => {}} />
          <View style={[styles.content, styles.shadow]}>
            {profesor.map((profesor) => (
              <TarjetaDescipcion
                key={profesor.id}
                name={profesor.username}
                uri={api.getFoto(profesor.foto)}
                description="ASIGNAR.PROFESOR"
                navigation={() => handleAsignarPress(profesor.id)}
              />
            ))}
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
};

export default AsignarPofesor;
