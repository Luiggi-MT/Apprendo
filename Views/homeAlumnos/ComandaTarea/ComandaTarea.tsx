import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
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
import { useFocusEffect } from "@react-navigation/native";
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
import WakeWord from "../../../class/WakeWord/WakeWord";

export default function ComandaTarea({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { id_tarea_estudiante, fechaSeleccionada } = route.params;
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { user } = useContext(UserContext);
  const student = user as Students;

  const api = new ConnectApi();
  const speak = Speak.getInstance();
  const hoy = fechaSeleccionada;
  const isProcessing = useRef(false);

  const todasVisitadas =
    aulas.length > 0 && aulas.every((aula) => aula.visitado);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await api.getDetalleComanda(
        id_tarea_estudiante,
        student.id,
        fechaSeleccionada,
      );
      console.log(JSON.stringify(data, null, 2));
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
    api
      .finalizarTarea(id_tarea_estudiante, student.id, fechaSeleccionada)
      .then((data) => {
        if (data) {
          if (student.asistenteVoz !== "none") {
            speak.hablar("¡Muy bien! Has terminado el reparto de hoy.");
          }
          navigation.goBack();
        }
      });
  };

  // ================= ASISTENTE DE VOZ =================

  const activarAsistente = useCallback(async () => {
    if (isProcessing.current) {
      console.log("⚠️ Asistente ocupado");
      return;
    }
    isProcessing.current = true;
    setIsListening(true);

    try {
      await speak.hablar("Te escucho");

      const comando = (await WakeWord.listenCommand()).toLocaleLowerCase();

      if (comando.includes("atrás") || comando.includes("atras")) {
        await speak.hablar("Volviendo atrás");
        navigation.goBack();
      } else if (
        comando.includes("finalizar") ||
        comando.includes("terminar")
      ) {
        if (todasVisitadas) {
          await finalizarTarea();
        } else {
          await speak.hablar("Primero necesitas visitar todas las aulas");
        }
      } else {
        // Buscar aula que coincida con el comando
        const aulaEncontrada = aulas.find((a) =>
          a.nombre_aula.toLowerCase().includes(comando),
        );

        if (aulaEncontrada) {
          irADetalleAula(aulaEncontrada);
        } else {
          await speak.hablar("No encontré esa aula, intenta de nuevo");
        }
      }
    } catch (error) {
      console.log("Error asistente:", error);
      await speak.hablar("No te he entendido");
    } finally {
      setIsListening(false);
      isProcessing.current = false;

      setTimeout(() => {
        if (student.asistenteVoz === "bidireccional") {
          WakeWord.startWake(activarAsistente);
        }
      }, 1000);
    }
  }, [aulas, todasVisitadas, navigation, student.asistenteVoz]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cargarDatos();
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const init = async () => {
        if (!isMounted) return;

        // Detener cualquier escucha previa y limpiar callbacks viejos
        await WakeWord.stopWake();

        // Esperar un bit antes de reactivar
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (student.asistenteVoz !== "none" && !loading) {
          await speak.hablar(
            "Vamos a ir a las aulas y preguntar por la comanda.",
          );

          if (student.asistenteVoz === "bidireccional") {
            await speak.hablar(
              "Dime el nombre de un aula o di finalizar cuando termines",
            );
            // Registrar el callback AQUÍ en esta pantalla
            WakeWord.startWake(activarAsistente);
          }
        }
      };

      init();

      return () => {
        isMounted = false;
        speak.detener();
        WakeWord.stopWake();
      };
    }, [loading, student.asistenteVoz, activarAsistente]),
  );

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

      <View style={[styles.content, styles.shadow]}>
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
    </SafeAreaProvider>
  );
}
