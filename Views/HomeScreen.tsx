import React, { useEffect, useState } from "react";
import { Text, View, FlatList, Image, TouchableOpacity } from "react-native";
import { scaleFont, styles } from "../styles/styles";
import Header from "../components/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Boton from "../components/Boton";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { Students } from "../class/Interface/Students";
import Buscador from "../components/Buscador";
import BotonPerfil from "../components/BotonPerfil";
import { homeScreem_styles } from "../styles/homeScreem_styles";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const api = new ConnectApi();
  const arassacService = new Arasaac();

  const [students, setStudents] = useState<Students[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [busqueda, setBusqueda] = useState(false);
  const [message, setMessage] = useState("");

  const itemsPerPage = 6;

  const totalPaginas = Math.ceil(limit / itemsPerPage) || 1;
  const paginaActual =
    offset <= itemsPerPage ? 1 : Math.ceil(offset / itemsPerPage);

  const loadData = (newOffset: number, term: string = "") => {
    if (term.trim().length > 0) {
      api.getEstudentByName(term, newOffset, itemsPerPage).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setLimit(data.count);
      });
    } else {
      api.getStudents(newOffset, itemsPerPage).then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setLimit(data.count);
      });
    }
  };

  useEffect(() => {
    loadData(0);
  }, []);

  const handleBuscadorPress = (searchText: string) => {
    if (searchText.trim().length === 0) {
      setBusqueda(false);
      setMessage("");
      loadData(0);
    } else {
      setBusqueda(true);
      setMessage(searchText);
      loadData(0, searchText);
    }
  };

  const handleSiguentePress = () => {
    loadData(offset, busqueda ? message : "");
  };

  const handleAtrasPress = () => {
    const prevOffset = Math.max(0, offset - 2 * itemsPerPage);
    loadData(prevOffset, busqueda ? message : "");
  };

  const onProfesoradoPress = () => {
    navigation.push("Profesorado");
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="profesor"
        nameBottom="PROFESORADO"
        navigation={onProfesoradoPress}
        nameHeader="APPRENDO"
        style={scaleFont(36)}
      />

      <View style={{ flex: 1 }}>
        <Buscador
          nameBuscador="BUSCAR ESTUDIANTE"
          onPress={handleBuscadorPress}
        />

        <View
          style={[styles.content, styles.shadow, { flex: 1, marginBottom: 0 }]}
        >
          {students.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.text}>NO SE HAN ENCONTRADO ESTUDIANTES</Text>
              <View style={styles.superPuesto}>
                <Image
                  source={{ uri: arassacService.getPictograma("estudiante") }}
                  style={styles.imageBase}
                />
                <Image
                  source={{ uri: arassacService.getPictograma("fallo") }}
                  style={styles.imageOverlay}
                />
              </View>
            </View>
          ) : (
            <FlatList
              data={students}
              numColumns={3}
              renderItem={({ item }) => (
                <BotonPerfil item={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item.username}
              columnWrapperStyle={homeScreem_styles.columnWrapper}
            />
          )}
        </View>

        <View
          style={[
            styles.navigationButtons,
            { paddingVertical: 10, backgroundColor: "transparent" },
          ]}
        >
          <Boton
            uri="atras"
            onPress={handleAtrasPress}
            dissable={offset <= itemsPerPage}
          />

          <View style={{ justifyContent: "center" }}>
            <Text
              style={[
                styles.text_legend,
                { fontSize: scaleFont(22), color: "#333" },
              ]}
            >
              {paginaActual} / {totalPaginas}
            </Text>
          </View>

          <Boton
            uri="delante"
            onPress={handleSiguentePress}
            dissable={offset >= limit}
          />
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerTextMain}>
          © {new Date().getFullYear()} APPRENDO
        </Text>
        <Text style={styles.footerTextSub}>DESARROLLADO POR LUIGGI.MT</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AcercaDe")}>
          <Text style={styles.footerLink}>ACERCA DE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}
