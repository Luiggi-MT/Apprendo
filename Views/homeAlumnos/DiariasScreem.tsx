import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Header from "../../components/Header";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { UserContext } from "../../class/context/UserContext";
import { scaleFont, styles } from "../../styles/styles";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Arasaac } from "../../class/Arasaac/getPictograma";
import { Students } from "../../class/Interface/Students";
import { Speak } from "../../class/Speak/Speak";
import { TareaEstudiante } from "../../class/Interface/Tarea";
import { useVoice } from "../../class/context/VoiceContext";
import Boton from "../../components/Boton";

export default function DiariasScreen({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const [tareas, setTareas] = useState<TareaEstudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [isListening, setIsListening] = useState(false);
  const [puntos, setPuntos] = useState<number>(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    route?.params?.fecha
      ? route.params.fecha
      : new Date().toISOString().split("T")[0],
  );
  const { user } = useContext(UserContext) as { user: Students };
  const student = user as Students;

  const esSemanales = route?.params?.semanales || false;

  const api = new ConnectApi();
  const arasaacService = new Arasaac();
  const speak = Speak.getInstance();
  const isProcessing = useRef(false);
  const voice = useVoice();

  const perfil = () => navigation.navigate("PerfilScreen");
  const atras = () => {
    speak.detener();
    navigation.goBack();
  };

  // Función para parsear fechas del comando de voz
  const parsearFechaDelComando = (comando: string): string | null => {
    const meses: { [key: string]: string } = {
      enero: "01",
      febrero: "02",
      marzo: "03",
      abril: "04",
      mayo: "05",
      junio: "06",
      julio: "07",
      agosto: "08",
      septiembre: "09",
      setiembre: "09",
      octubre: "10",
      noviembre: "11",
      diciembre: "12",
    };

    // Buscar patrón como "3 de febrero" o "dia 3 de febrero"
    const regexPatron = /(?:día|del?)?\s*(\d{1,2})\s+de\s+(\w+)/i;
    const match = comando.match(regexPatron);

    if (match) {
      const dia = match[1].padStart(2, "0");
      const mesNombre = match[2].toLowerCase();
      const mesNumero = meses[mesNombre];

      if (mesNumero) {
        const año = new Date().getFullYear();
        return `${año}-${mesNumero}-${dia}`;
      }
    }
    return null;
  };

  // Función para obtener la última tarea pendiente
  const obtenerUltimaTareaPendiente = (): TareaEstudiante | null => {
    const tareasPendientes = tareas.filter((t) => t.completado === 0);
    return tareasPendientes.length > 0
      ? tareasPendientes[tareasPendientes.length - 1]
      : null;
  };

  // Función para obtener la primera tarea pendiente
  const obtenerPrimeraTareaPendiente = (): TareaEstudiante | null => {
    const tareasPendientes = tareas.filter((t) => t.completado === 0);
    return tareasPendientes.length > 0 ? tareasPendientes[0] : null;
  };

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const response = await api.getTareaEstudiante(
        student.id,
        offset,
        limit,
        fechaSeleccionada,
      );

      setTareas(response.tareasEstudiante || []);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, [fechaSeleccionada, offset, limit]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cargarTareas();
      api.getTrofeos(student.id).then((response) => {
        setPuntos(response.puntos || 0);
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    api.getTrofeos(student.id).then((response) => {
      setPuntos(response.puntos || 0);
    });
  }, [user]);

  // ================= ASISTENTE DE VOZ =================

  const activarAsistente = useCallback(async () => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    setIsListening(true);

    try {
      await speak.hablar("Te escucho");

      const comando = (await voice.listenCommand()).toLocaleLowerCase();

      // Comando: realizar la primera tarea pendiente
      if (comando.includes("vamos")) {
        const primeraTarea = obtenerPrimeraTareaPendiente();
        if (primeraTarea) {
          await speak.hablar(`Vamos a realizar: ${primeraTarea.nombre}`);
          manejarPresionarTarea(primeraTarea);
        } else {
          await speak.hablar("No tienes tareas pendientes en este momento");
        }
      } else if (comando.includes("atrás") || comando.includes("atras")) {
        await speak.hablar("Volviendo atrás");
        navigation.goBack();
      } else {
        // Buscar tarea que coincida con el comando
        const tareaEncontrada = tareas.find((t) =>
          t.nombre.toLowerCase().includes(comando),
        );

        if (tareaEncontrada) {
          manejarPresionarTarea(tareaEncontrada);
        } else {
          await speak.hablar("No he entendido el comando, intenta de nuevo");
        }
      }
    } catch (error) {
      await speak.hablar("No te he entendido");
    } finally {
      setIsListening(false);
      isProcessing.current = false;

      // Solo reinicia si seguimos en la pantalla de tareas
      setTimeout(() => {
        if (student.asistenteVoz === "bidireccional") {
          voice.startWake(activarAsistente);
        }
      }, 1000);
    }
  }, [tareas, navigation, student.asistenteVoz]);

  // UseEffect para inicializar y limpiar el asistente
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        // Detener cualquier escucha previa y limpiar callbacks viejos
        await voice.stopWake();

        // Esperar un bit antes de reactivar
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!loading && student.asistenteVoz !== "none") {
          const fechaFormato = speak.formatearFechaVerbal(fechaSeleccionada);
          if (tareas.length === 0) {
            await speak.hablar(
              `¡Genial! No tienes tareas pendientes para ${fechaFormato}.`,
            );
          } else {
            const pendientes = tareas.filter((t) => t.completado === 0).length;
            if (pendientes > 0) {
              if (pendientes === 1)
                speak.hablar(
                  `Tienes ${pendientes} tarea pendiente para ${fechaFormato}.`,
                );
              else
                speak.hablar(
                  `Tienes ${pendientes} tareas pendientes para ${fechaFormato}.`,
                );
            } else {
              speak.hablar(
                `¡Muy bien! Has terminado todas tus tareas para ${fechaFormato}.`,
              );
            }
          }

          if (student.asistenteVoz === "bidireccional") {
            const pendientes = tareas.filter((t) => t.completado === 0).length;
            if (pendientes > 0) {
              await speak.hablar(
                'Di el nombre de una tarea para hacerla o "atrás" para volver al menú principal',
              );
            } else {
              await speak.hablar('Di "atrás" para volver al menú principal');
            }

            // Registrar el callback AQUÍ en esta pantalla
            voice.startWake(activarAsistente);
          }
        }
      };

      init();
    }, []),
  );

  const manejarPresionarTarea = (tarea: TareaEstudiante) => {
    if (student.asistenteVoz !== "none") {
      speak.hablar(`Vamos a hacer: ${tarea.nombre}`);
    }

    if (tarea.categoria.toUpperCase() === "COMANDA") {
      navigation.navigate("ComandaTarea", {
        id_tarea_estudiante: tarea.id,
        fechaSeleccionada: fechaSeleccionada,
      });
    } else if (tarea.categoria.toUpperCase() === "MATERIAL_ESCOLAR") {
      navigation.navigate("PedidoMaterialTarea", {
        id_tarea_estudiante: tarea.id,
        fechaSeleccionada: fechaSeleccionada,
      });
    }
  };
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri={esSemanales ? "volver" : student.foto}
        nameBottom={esSemanales ? "ATRÁS" : "PERFIL"}
        navigation={esSemanales ? atras : perfil}
        nameHeader="MIS TAREAS"
        uriPictograma="lista"
        arasaacService={esSemanales}
        style={scaleFont(28)}
      />

      <View
        style={[localStyles.contenido, { paddingBottom: 100 + insets.bottom }]}
      >
        {loading === true ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#FF8C42" />
          </View>
        ) : tareas.length === 0 ? (
          <View style={{ alignItems: "center" }}>
            <View style={localStyles.insigniaCoheteContainer}>
              <View style={localStyles.insigniaCoheteLottieWrapper}>
                <LottieView
                  source={require("../../assets/animations/cup.json")}
                  autoPlay
                  loop={false}
                  style={localStyles.insigniaCoheteLottie}
                />
              </View>
              <Text style={localStyles.insigniaCoheteTexto}> {puntos}</Text>
            </View>
            <Text style={localStyles.textoExito}>¡TODO TERMINADO POR HOY!</Text>
            <View style={{ width: 300, height: 300, overflow: "hidden" }}>
              <LottieView
                source={require("../../assets/animations/clapping.json")}
                autoPlay
                loop
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
        ) : (
          <View>
            <View style={localStyles.insigniaCoheteContainer}>
              <View style={localStyles.insigniaCoheteLottieWrapper}>
                <LottieView
                  source={require("../../assets/animations/cup.json")}
                  autoPlay
                  loop={false}
                  style={localStyles.insigniaCoheteLottie}
                />
              </View>
              <Text style={localStyles.insigniaCoheteTexto}> {puntos}</Text>
            </View>
            {tareas.map((tarea) => (
              <TouchableOpacity
                key={tarea.id}
                activeOpacity={0.9}
                onPress={() => manejarPresionarTarea(tarea)}
                style={[
                  styles.shadow,
                  localStyles.cardTarea,
                  {
                    borderColor: !tarea.completado ? "#FF8C42" : "#4CAF50",
                    opacity: !tarea.completado ? 1 : 0.8,
                  },
                ]}
              >
                <View style={localStyles.contenedorImagen}>
                  <Image
                    source={{
                      uri: arasaacService.getPictogramaId(tarea.id_pictograma),
                    }}
                    style={localStyles.imagenTarea}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text
                    style={[
                      localStyles.tituloTarea,
                      {
                        color: !tarea.completado ? "#333" : "#777",
                        textDecorationLine: !tarea.completado
                          ? "none"
                          : "line-through",
                      },
                    ]}
                  >
                    {tarea.nombre.toUpperCase()}
                  </Text>

                  <View style={localStyles.contenedorEstado}>
                    <View
                      style={[
                        localStyles.puntoEstado,
                        {
                          backgroundColor: !tarea.completado
                            ? "#FF8C42"
                            : "#4CAF50",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        localStyles.textoEstado,
                        {
                          color: !tarea.completado ? "#FF8C42" : "#4CAF50",
                        },
                      ]}
                    >
                      {!tarea.completado ? "PENDIENTE" : "COMPLETADO"}
                    </Text>
                  </View>
                </View>

                <View style={{ marginRight: 5 }}>
                  <Image
                    source={{
                      uri: arasaacService.getPictograma(
                        !tarea.completado ? "adelante" : "ok",
                      ),
                    }}
                    style={{ width: 40, height: 40, opacity: 0.8 }}
                  />
                </View>

                {tarea.completado === 1 && (
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

      {!loading && tareas.length > 0 && (
        <View
          style={[
            localStyles.barraNavegacionFija,
            { paddingBottom: insets.bottom + 6 },
          ]}
        >
          <Boton uri="atras" onPress={() => {}} />
          <Boton uri="delante" onPress={() => {}} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  contenido: {
    padding: 15,
    flex: 1,
  },
  barraNavegacionFija: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 15,
    paddingTop: 8,
    backgroundColor: "#E9E9E9",
    borderTopWidth: 1,
    borderTopColor: "#D6D6D6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insigniaCoheteContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4EA",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#FFD7B8",
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  insigniaCoheteLottieWrapper: {
    width: 50,
    height: 50,
    overflow: "hidden",
  },
  insigniaCoheteLottie: {
    width: 50,
    height: 50,
  },
  insigniaCoheteTexto: {
    marginLeft: 6,
    fontFamily: "escolar-bold",
    fontSize: scaleFont(20),
    color: "#C26017",
  },
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
