import { View, Text, Image, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scaleFont, styles } from "../../../styles/styles";
import Header from "../../../components/Header";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { UserContext } from "../../../class/context/UserContext";
import PasoAula from "../../../components/PasoAula";
import Boton from "../../../components/Boton";
import LottieView from "lottie-react-native";
import { useAudioPlayer } from "expo-audio";
import PasoMaterial from "../../../components/PasoMaterial";
import { Students } from "../../../class/Interface/Students";
import { Arasaac } from "../../../class/Arasaac/getPictograma";

const OK_ANIMATION_MS = 5000;
const OK_SOUND_DELAY_MS = 2900;
const CUP_ANIMATION_MS = 3000;

const PedidoMaterialTarea = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) => {
  const { id_tarea_estudiante, fechaSeleccionada } = route?.params;
  const insets = useSafeAreaInsets();
  const atras = () => navigation.goBack();
  const [aulas, setAulas] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [pasos, setPasos] = useState<any[]>([]);
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [pasosCompletados, setPasosCompletados] = useState<Set<number>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completado, setCompletado] = useState<boolean>(false);
  const [numeroCompletado, setNumeroCompletado] = useState<number>(0);
  const [completadoTarea, setCompletadoTarea] = useState<boolean>(false);
  const api = new ConnectApi();
  const student = useContext(UserContext).user as Students;
  const arasaacService = new Arasaac();
  const okPlayer = useAudioPlayer(require("../../../assets/sounds/ok.mp3"));
  const cupPlayer = useAudioPlayer(require("../../../assets/sounds/cup.mp3"));

  useEffect(() => {
    okPlayer.loop = false;
  }, [okPlayer]);

  const handleOkPress = async () => {
    let pasoHecho = false;
    if (pasos[pasoActual].tipo === "aula") {
      const response = await api.visitadoAula(
        pasos[pasoActual].aula_id,
        student.id,
        fechaSeleccionada,
      );
      pasoHecho = !!response;
    } else if (pasos[pasoActual].tipo === "material") {
      const response = await api.seleccionadoMaterial(
        pasos[pasoActual].profesor_id,
        pasos[pasoActual].id,
        fechaSeleccionada,
      );
      pasoHecho = !!response;
    }
    if (pasoHecho) {
      setPasosCompletados((prev) => new Set(prev).add(pasoActual));
      setPasoActual((p) => Math.min(p + 1, pasos.length - 1));
      setIsLoading(true);
      setTimeout(async () => {
        try {
          await okPlayer.seekTo(0);
          okPlayer.play();
        } catch (error) {
          console.error("No se pudo reproducir ok.mp3:", error);
        }
      }, OK_SOUND_DELAY_MS);
      setTimeout(() => {
        setIsLoading(false);
      }, OK_ANIMATION_MS);
    }
  };

  const handleTerminarTarea = async () => {
    const response = await api.finalizarTarea(
      id_tarea_estudiante,
      student.id,
      fechaSeleccionada,
    );
    if (response) {
      setCompletadoTarea(true);
      cupPlayer.play();
      setTimeout(() => {
        navigation.goBack();
      }, CUP_ANIMATION_MS);
    }
  };
  useEffect(() => {
    api
      .getTareaMaterialAulas(id_tarea_estudiante, fechaSeleccionada, student.id)
      .then((response: any) => {
        setAulas(response.aulas);
        console.log("Aulas:", JSON.stringify(response.aulas, null, 2));
      });
    api
      .getTareaMaterialMateriales(
        id_tarea_estudiante,
        fechaSeleccionada,
        student.id,
      )
      .then((response: any) => {
        setMateriales(response);
      });
  }, []);

  useEffect(() => {
    if (aulas.length === 0) return;
    const lista = [
      { tipo: "aula", ...aulas[0] },
      ...materiales.map((m: any) => ({ tipo: "material", ...m })),
      { tipo: "aula", ...aulas[aulas.length - 1] },
    ];
    setPasos(lista);
    setPasoActual(0);

    const completados = new Set<number>();
    lista.forEach((paso, index) => {
      if (paso.tipo === "aula" && paso.visitado) completados.add(index);
      if (paso.tipo === "material" && paso.seleccionado) completados.add(index);
    });
    setPasosCompletados(completados);

    const primerPendiente = lista.findIndex(
      (paso, index) => !completados.has(index),
    );
    setPasoActual(primerPendiente >= 0 ? primerPendiente : 0);
  }, [aulas, materiales]);

  useEffect(() => {}, [student]);
  const irAtras = () => setPasoActual((p) => Math.max(0, p - 1));
  const irDelante = () =>
    setPasoActual((p) => Math.min(pasos.length - 1, p + 1));

  useEffect(() => {
    const count = pasos.reduce((acc, paso) => {
      if (paso.tipo === "aula") return acc + (paso.visitado === 1 ? 1 : 0);
      return acc + (paso.seleccionado === 1 ? 1 : 0);
    }, 0);
    setNumeroCompletado(count);
  }, [pasos]);

  useEffect(() => {
    setCompletado(pasos.length > 0 && pasosCompletados.size === pasos.length);
  }, [pasosCompletados, pasos]);

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="PEDIDO.DE.MATERIAL"
        uriPictograma="materialEscolar"
        style={scaleFont(30)}
      />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            source={require("../../../assets/animations/ok.json")}
            autoPlay
            loop
            style={{ width: 700, height: 700 }}
          />
        </View>
      ) : completadoTarea ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <LottieView
            source={require("../../../assets/animations/cup.json")}
            autoPlay
            loop={false}
            style={{ width: 700, height: 700 }}
          />
        </View>
      ) : (
        <View>
          <View style={[styles.content, styles.shadow]}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {pasos[pasoActual]?.tipo === "aula" ? (
                <PasoAula
                  uri="ir"
                  aula={pasos[pasoActual]}
                  accesibilidad={student.accesibilidad}
                />
              ) : (
                <PasoMaterial
                  material={pasos[pasoActual]}
                  accesibilidad={student.accesibilidad}
                />
              )}
            </View>
            <View style={[styles.navigationButtons]}>
              <Boton uri="atras" onPress={irAtras} />
              {completado === true ? (
                <Boton
                  uri="ok"
                  onPress={handleTerminarTarea}
                  nameBottom="TERMINAR.TAREA"
                />
              ) : (
                <Boton uri="ok" onPress={handleOkPress} nameBottom="HECHO" />
              )}
              <Boton uri="delante" onPress={irDelante} />
            </View>
          </View>
          <View>
            <Boton uri="chat" onPress={() => {}} nameBottom="CHAT" />
          </View>
          <View style={localStyles.progresoBarra}>
            {pasos.map((paso, index) => {
              const completado = pasosCompletados.has(index);
              const actual = index === pasoActual;
              const imgUri =
                paso.tipo === "aula"
                  ? paso.aula === "ALMACEN"
                    ? arasaacService.getPictograma("caminar")
                    : arasaacService.getPictograma("regresar")
                  : paso.pictogramaId
                    ? arasaacService.getPictogramaId(paso.pictogramaId)
                    : api.getMedia(paso.imagen);
              return (
                <View key={index} style={localStyles.pasoItem}>
                  <View
                    style={[
                      localStyles.iconWrapper,
                      actual && localStyles.iconWrapperActual,
                    ]}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={[
                        localStyles.monigote,
                        actual && localStyles.monigoteActual,
                        !completado && !actual && localStyles.monigotePendiente,
                      ]}
                    />
                    {completado && (
                      <View style={localStyles.checkOverlay}>
                        <Text style={localStyles.checkText}>✓</Text>
                      </View>
                    )}
                  </View>
                  {actual && <View style={localStyles.puntito} />}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
};

export default PedidoMaterialTarea;

const localStyles = StyleSheet.create({
  progresoBarra: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  pasoItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  monigote: {
    width: 58,
    height: 58,
    borderRadius: 10,
  },
  monigoteActual: {
    width: 72,
    height: 72,
    borderRadius: 12,
  } as any,
  monigoteCompletado: {
    opacity: 0.5,
  },
  monigotePendiente: {
    opacity: 0.25,
  },
  puntito: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF8C42",
    marginTop: 4,
  },
  iconWrapper: {
    position: "relative",
  },
  iconWrapperActual: {
    borderWidth: 2,
    borderColor: "#FF8C42",
    borderRadius: 12,
  },
  checkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 10,
  },
  checkText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
