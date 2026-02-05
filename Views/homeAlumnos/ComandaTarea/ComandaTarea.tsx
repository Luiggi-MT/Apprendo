import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Buscador from "../../../components/Buscador";
import { scaleFont, styles } from "../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { Aula } from "../../../class/Interface/Aula";
import { Speak } from "../../../class/Speak/Speak";
import { UserContext } from "../../../class/context/UserContext";
import { Students } from "../../../class/Interface/Students";
import Boton from "../../../components/Boton";

export default function ComandaTarea({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { id_tarea_estudiante } = route.params;
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useContext(UserContext);
  const student = user as Students;

  const api = new ConnectApi();
  const speak = new Speak();
  const hoy = new Date().toISOString().split("T")[0];

  const todasVisitadas =
    aulas.length > 0 && aulas.every((aula) => aula.visitado);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await api.getDetalleComanda(id_tarea_estudiante);
      if (data) {
        setAulas(data.aulas);
        setMenu(data.menu_del_dia);
      }
    } catch (error) {
      console.error("Error al cargar comandas:", error);
    } finally {
      setLoading(false);
    }
  };

  const finalizarTarea = async () => {
    api.finalizarTarea(id_tarea_estudiante).then((data) => {
      if (data) {
        if (student.asistenteVoz !== "none") {
          speak.hablar("¡Muy bien! Has terminado el reparto de hoy.");
        }
        navigation.goBack();
      }
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cargarDatos();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (student.asistenteVoz !== "none") {
      speak.hablar("Vamos a ir a las aulas y preguntar por la comanda.");
    }
  }, [student]);

  const aulasFiltradas = aulas.filter((a) =>
    a.nombre_aula.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const renderAula = ({ item }: { item: Aula }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          marginVertical: 4,
          borderLeftWidth: 8,
          borderLeftColor: item.visitado ? "#4CAF50" : "#FF8C42",
          height: 85,
        },
      ]}
      onPress={() => irADetalleAula(item)}
    >
      <Image
        source={{ uri: api.getFoto(item.foto_profesor) }}
        style={{
          width: 55,
          height: 55,
          borderRadius: 27,
          marginRight: 12,
          backgroundColor: "#EEE",
        }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "escolar-bold", fontSize: scaleFont(18) }}>
          {item.nombre_aula}
        </Text>
        <Text style={{ color: "#666", fontSize: scaleFont(14) }}>
          Prof: {item.nombre_profesor}
        </Text>
      </View>

      <Ionicons
        name={item.visitado ? "checkmark-circle" : "chevron-forward"}
        size={30}
        color={item.visitado ? "#4CAF50" : "#CCC"}
      />
    </TouchableOpacity>
  );

  const irADetalleAula = (aula: Aula) => {
    navigation.navigate("ComandaAula", {
      aula: aula,
      menu: menu,
      id_tarea_estudiante: id_tarea_estudiante,
      fecha: hoy,
    });
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#F5F5F5" }}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={() => navigation.goBack()}
        nameHeader="COMANDA"
        uriPictograma="pollo"
        style={scaleFont(25)}
      />

      <Buscador
        nameBuscador="BUSCAR AULA"
        onPress={(text: string) => setBusqueda(text)}
      />

      <View style={[styles.content, styles.shadow, ,]}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF8C42"
            style={{ marginTop: 10 }}
          />
        ) : (
          <FlatList
            data={aulasFiltradas}
            keyExtractor={(item) => item.id_visita.toString()}
            renderItem={renderAula}
            contentContainerStyle={{ paddingBottom: 10 }}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: scaleFont(16),
                }}
              >
                No hay aulas
              </Text>
            }
          />
        )}

        <View
          style={[styles.navigationButtons, { backgroundColor: "transparent" }]}
        >
          <Boton uri="atras" onPress={() => navigation.goBack()} />

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {todasVisitadas && (
              <Boton
                nameBottom="FINALIZAR"
                uri="hecho"
                onPress={finalizarTarea}
              />
            )}
          </View>

          <Boton uri="delante" onPress={() => {}} />
        </View>
      </View>

      {student.asistenteVoz === "bidireccional" && (
        <View style={{ alignItems: "center", paddingBottom: 10 }}>
          <Boton component={true} uri="Cohete.png" onPress={() => {}} />
        </View>
      )}
    </SafeAreaProvider>
  );
}
