import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import Header from "../../../components/Header";
import Buscador from "../../../components/Buscador";
import { Students } from "../../../class/Interface/Students";
import { scaleFont, styles } from "../../../styles/styles";
import { View, Text, Image } from "react-native";
import TarjetaDescipcion from "../../../components/TarjetaDescripcion";
import Boton from "../../../components/Boton";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
export default function GestionEstudiantes({
  navigation,
}: {
  navigation: any;
}) {
  const api = new ConnectApi();
  const arasaacService = new Arasaac();
  const [students, setStudents] = useState<Students[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [busqueda, setBusqueda] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const atras = () => {
    navigation.goBack();
  };
  const handleBuscadorPress = (searchText: string) => {
    if (searchText.length === 0) {
      setBusqueda(false);
      api.getStudents(0, 3).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setLimit(data.count);
      });
    } else {
      api.getEstudentByName(searchText, 0, 3).then((data) => {
        setBusqueda(true);
        if (data.students || []) {
          setStudents(data.students || []);
          setOffset(data.offset);
          setLimit(data.count);
          setMessage(searchText);
        } else {
          setStudents([]);
          setOffset(0);
          setLimit(0);
        }
      });
    }
  };
  const handleAtrasPress = () => {
    if (busqueda) {
      api
        .getEstudentByName(message, offset - 2 * api.getLimit(), 3)
        .then((data) => {
          setStudents(data.students);
          setOffset(data.offset);
          setLimit(data.count);
        });
    } else {
      api.getStudents(offset - 2 * api.getLimit(), 3).then((data) => {
        setStudents(data.students);
        setOffset(data.offset);
        setLimit(data.count);
      });
    }
  };
  const handleSiguientePress = () => {
    if (busqueda) {
      api.getEstudentByName(message, offset, 3).then((data) => {
        setStudents(data.students);
        setOffset(data.offset);
        setLimit(data.count);
      });
    } else {
      api.getStudents(offset, 3).then((data) => {
        setStudents(data.students);
        setOffset(data.offset);
        setLimit(data.count);
      });
    }
  };
  const handleDescripcionPress = (student) => {
    navigation.replace("DescripcionEstudiante", { student });
  };
  const handleCreaPress = () => {
    navigation.navigate("CrearEstudiante");
  };

  useEffect(() => {
    api.getStudents(offset, limit).then((data) => {
      setStudents(data.students || []);
      setOffset(data.offset);
      setLimit(data.count);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="GESTIÓN.DE.ESTUDIANTES"
        uriPictograma="estudiante"
        style={scaleFont(18)}
      />
      <Buscador
        nameBuscador="BUSCAR ESTUDIANTE"
        onPress={handleBuscadorPress}
      />
      <View style={[styles.content, styles.shadow]}>
        {students && students.length > 0 ? (
          <>
            {students.map((student) => (
              <TarjetaDescipcion
                key={student.username}
                name={student.username}
                uri={api.getFoto(student.foto)}
                description="VER ALUMNO"
                navigation={() => handleDescripcionPress(student)}
              />
            ))}
            <View style={styles.navigationButtons}>
              <Boton
                uri="atras"
                onPress={handleAtrasPress}
                dissable={offset <= 0}
              />
              <Boton
                uri="delante"
                onPress={handleSiguientePress}
                dissable={offset >= limit}
              />
            </View>
          </>
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.text}>NO SE HA ENCONTRADO ESTUDIANTE</Text>
            <View style={[styles.superPuesto]}>
              <Image
                source={{ uri: arasaacService.getPictograma("estudiante") }}
                style={styles.imageBase}
              />
              <Image
                source={{ uri: arasaacService.getPictograma("fallo") }}
                style={styles.imageOverlay}
              />
            </View>
          </View>
        )}
      </View>
      <Boton uri="mas" nameBottom="CREAR ALUMNO" onPress={handleCreaPress} />
    </SafeAreaProvider>
  );
}
