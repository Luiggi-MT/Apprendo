import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { UserContext } from "../../class/context/UserContext";
import { scaleFont, styles } from "../../styles/styles";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Arasaac } from "../../class/Arasaac/getPictograma";
import { Students } from "../../class/Interface/Students";
import { Speak } from "../../class/Speak/Speak";
import { Tarea } from "../../class/Interface/Tarea";

export default function DiariasScreen({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useContext(UserContext);
  const student = user as Students;

  const esSemanales = route?.params?.semanales || false;
  const fechaSeleccionada = route?.params?.fecha
    ? route.params.fecha
    : new Date().toISOString().split("T")[0];

  const api = new ConnectApi();
  const arasaacService = new Arasaac();
  const speak = new Speak();

  const perfil = () => navigation.navigate("PerfilScreen");
  const atras = () => {
    speak.detenerAsistente();
    navigation.goBack();
  };

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const response = await api.getTareaEstudiante(
        student.id,
        0,
        10,
        fechaSeleccionada,
      );
      setTareas(response.tareas || []);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, [fechaSeleccionada]);

  useEffect(() => {
    if (!loading && student.asistenteVoz !== "none") {
      if (tareas.length === 0) {
        speak.hablar(`¡Genial! No tienes tareas pendientes para hoy.`);
      } else {
        const pendientes = tareas.filter((t) => t.esta_pendiente).length;
        if (pendientes > 0) {
          speak.hablar(`Tienes ${pendientes} tareas pendientes.`);
        } else {
          speak.hablar(`¡Muy bien! Has terminado todas tus tareas.`);
        }
      }
    }
  }, [tareas, loading]);

  const manejarPresionarTarea = (tarea: Tarea) => {
    if (student.asistenteVoz !== "none") {
      speak.hablar(`Vamos a hacer: ${tarea.titulo}`);
    }

    if (tarea.titulo.toUpperCase() === "COMANDA") {
      navigation.navigate("ComandaTarea", {
        id_tarea_estudiante: tarea.id_tarea_estudiante,
      });
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#F5F5F5" }}>
      <Header
        uri={esSemanales ? "volver" : student.foto}
        nameBottom={esSemanales ? "ATRÁS" : "PERFIL"}
        navigation={esSemanales ? atras : perfil}
        nameHeader="MIS TAREAS"
        uriPictograma="lista"
        arasaacService={esSemanales}
        style={scaleFont(28)}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 15 }}>
          {loading ? (
            <View style={{ marginTop: 50 }}>
              <ActivityIndicator size="large" color="#FF8C42" />
            </View>
          ) : tareas.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={localStyles.textoExito}>
                ¡TODO TERMINADO POR HOY!
              </Text>
              <Image
                source={{ uri: arasaacService.getPictograma("ok") }}
                style={{ width: 220, height: 220 }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View>
              {tareas.map((tarea) => (
                <TouchableOpacity
                  key={tarea.id_tarea_estudiante}
                  activeOpacity={0.9}
                  onPress={() => manejarPresionarTarea(tarea)}
                  style={[
                    styles.shadow,
                    localStyles.cardTarea,
                    {
                      borderColor: tarea.esta_pendiente ? "#FF8C42" : "#4CAF50",
                      opacity: tarea.esta_pendiente ? 1 : 0.8,
                    },
                  ]}
                >
                  <View style={localStyles.contenedorImagen}>
                    <Image
                      source={{
                        uri: arasaacService.getPictogramaId(tarea.uri),
                      }}
                      style={localStyles.imagenTarea}
                    />
                  </View>

                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text
                      style={[
                        localStyles.tituloTarea,
                        {
                          color: tarea.esta_pendiente ? "#333" : "#777",
                          textDecorationLine: tarea.esta_pendiente
                            ? "none"
                            : "line-through",
                        },
                      ]}
                    >
                      {tarea.titulo.toUpperCase()}
                    </Text>

                    <View style={localStyles.contenedorEstado}>
                      <View
                        style={[
                          localStyles.puntoEstado,
                          {
                            backgroundColor: tarea.esta_pendiente
                              ? "#FF8C42"
                              : "#4CAF50",
                          },
                        ]}
                      />
                      <Text
                        style={[
                          localStyles.textoEstado,
                          {
                            color: tarea.esta_pendiente ? "#FF8C42" : "#4CAF50",
                          },
                        ]}
                      >
                        {tarea.esta_pendiente ? "PENDIENTE" : "COMPLETADO"}
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginRight: 5 }}>
                    <Image
                      source={{
                        uri: arasaacService.getPictograma(
                          tarea.esta_pendiente ? "adelante" : "ok",
                        ),
                      }}
                      style={{ width: 40, height: 40, opacity: 0.8 }}
                    />
                  </View>

                  {!tarea.esta_pendiente && (
                    <View style={localStyles.overlayCentrado}>
                      <Image
                        source={{ uri: arasaacService.getPictograma("x") }}
                        style={localStyles.imagenXGrande}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  textoExito: {
    fontFamily: "escolar-bold",
    fontSize: scaleFont(26),
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 20,
  },
  cardTarea: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    position: "relative",
    overflow: "hidden",
  },
  contenedorImagen: {
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  imagenTarea: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  tituloTarea: {
    fontFamily: "escolar-bold",
    fontSize: scaleFont(22),
    lineHeight: 28,
  },
  contenedorEstado: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  puntoEstado: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  textoEstado: {
    fontFamily: "escolar-bold",
    fontSize: scaleFont(16),
  },
  overlayCentrado: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 10,
  },
  imagenXGrande: {
    width: "200%",
    height: "200%",
    opacity: 0.9,
  },
});
