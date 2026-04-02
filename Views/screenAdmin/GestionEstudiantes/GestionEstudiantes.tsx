import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
  const [limit] = useState<number>(3);
  const [total, setTotal] = useState<number>(0);
  const [busqueda, setBusqueda] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const totalPaginas = Math.ceil(total / limit) || 1;
  const paginaActual = offset <= limit ? 1 : Math.ceil(offset / limit);

  const atras = () => {
    navigation.goBack();
  };

  const handleBuscadorPress = (searchText: string) => {
    if (searchText.trim().length === 0) {
      setBusqueda(false);
      setMessage("");

      api.getStudents(0, limit).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    } else {
      api.getEstudentByName(searchText, 0, limit).then((data) => {
        setBusqueda(true);
        setMessage(searchText);
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    }
  };

  const handleAtrasPress = () => {
    const previousOffset = offset - 2 * limit;

    if (busqueda) {
      api.getEstudentByName(message, previousOffset, limit).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    } else {
      api.getStudents(previousOffset, limit).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    }
  };

  const handleSiguientePress = () => {
    if (busqueda) {
      api.getEstudentByName(message, offset, limit).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    } else {
      api.getStudents(offset, limit).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    }
  };

  const handleDescripcionPress = (student: Students) => {
    navigation.navigate("DescripcionEstudiante", { student });
  };

  const handleCreaPress = () => {
    navigation.navigate("CrearEstudiante");
  };

  useEffect(() => {
    api.getStudents(0, limit).then((data) => {
      setStudents(data.students || []);
      setOffset(data.offset);
      setTotal(data.count);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      api.getStudents(0, limit).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setTotal(data.count);
      });
    });
    return unsubscribe;
  }, [navigation]);
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
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
                description="VER.ALUMNO"
                navigation={() => handleDescripcionPress(student)}
              />
            ))}

            <View style={styles.navigationButtons}>
              <Boton
                uri="atras"
                onPress={handleAtrasPress}
                dissable={offset <= limit}
              />

              <Text
                style={[
                  styles.text_legend,
                  { fontSize: scaleFont(22), color: "#333" },
                ]}
              >
                {paginaActual} / {totalPaginas}
              </Text>

              <Boton
                uri="delante"
                onPress={handleSiguientePress}
                dissable={offset >= total}
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
