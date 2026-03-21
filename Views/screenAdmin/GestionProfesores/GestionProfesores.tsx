import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { View } from "react-native";
import Buscador from "../../../components/Buscador";
import { Profesor } from "../../../class/Interface/Profesor";
import None from "../../../components/None";
import Boton from "../../../components/Boton";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import TarjetaDescipcion from "../../../components/TarjetaDescripcion";
import { UserContext } from "../../../class/context/UserContext";
export default function GestionProfesores({ navigation }: { navigation: any }) {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [total, setTotal] = useState<number>(0);

  const api = new ConnectApi();

  const handleAtrasPress = async () => {};

  const handleDelantePress = async () => {};
  const atras = () => {
    navigation.goBack();
  };

  const handleCrearProfesorPress = () => {
    navigation.navigate("CrearProfesor");
  };
  useEffect(() => {
    api.getProfesores(offset, limit).then((response) => {
      setOffset(response.offset);
      setTotal(response.total);
      setProfesores(response.profesores);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="GESTIÓN.DE.PROFESORES"
        uriPictograma="profesor"
        style={scaleFont(20)}
      />
      {profesores.length === 0 && (
        <None description="NO SE HAN ENCONTRADO PROFESORES" uri="profesor" />
      )}
      {profesores.length > 0 && (
        <View>
          <Buscador nameBuscador="BUSCAR PROFESOR" onPress={() => {}} />
          <View style={[styles.content, styles.shadow]}>
            {profesores.map((profesorItem) => (
              <TarjetaDescipcion
                key={profesorItem.id}
                name={profesorItem.username}
                uri={api.getFoto(profesorItem.foto)}
                description="VER.PORFESOR"
                navigation={() => {}}
              />
            ))}
            <View style={styles.navigationButtons}>
              <Boton
                uri="atras"
                onPress={handleAtrasPress}
                dissable={offset <= limit}
              />
              <Boton
                uri="delante"
                onPress={handleDelantePress}
                dissable={offset >= total}
              />
            </View>
          </View>
        </View>
      )}
      <View style={[styles.bottomContainerHeder, { alignItems: "center" }]}>
        <Boton
          nameBottom="CREAR.PROFESOR"
          uri="mas"
          onPress={handleCrearProfesorPress}
        />
      </View>
    </SafeAreaProvider>
  );
}
