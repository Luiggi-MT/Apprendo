import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import Header from "../../components/Header";
import Boton from "../../components/Boton";
import { styles, scaleFont } from "../../styles/styles";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { Speak } from "../../class/Speak/Speak";
import { UserContext } from "../../class/context/UserContext";

import { ImagePassword } from "../../class/Interface/ImagePassword";
import { useVoice } from "../../class/context/VoiceContext";
import { useFocusEffect } from "@react-navigation/native";
import { homeScreem_styles } from "../../styles/homeScreem_styles";

export default function LoginAlumnoImagenes({ navigation, route }: any) {
  const { student } = route.params;

  const api = new ConnectApi();
  const speak = Speak.getInstance();
  const { setUser } = useContext(UserContext);

  const [password, setPassword] = useState<ImagePassword[]>([]);
  const [selected, setSelected] = useState<ImagePassword[]>([]);
  const [failedIds, setFailedIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const initializedRef = useRef(false);
  const isProcessing = useRef(false);
  const selectedRef = useRef<ImagePassword[]>([]);

  const voice = useVoice();

  // ================= ASISTENTE =================

  const activarAsistente = useCallback(async () => {
    if (isProcessing.current) {
      return;
    }

    isProcessing.current = true;
    setIsListening(true);

    try {
      await speak.hablar("Te escucho");

      const comando = (await voice.listenCommand()).toLowerCase();

      if (comando.includes("confirmar")) {
        await voice.pauseListening();
        await handleConfirmarPress();
      } else if (comando.includes("borrar") || comando.includes("eliminar")) {
        handleBorrarPress();
      } else if (comando.includes("atrás") || comando.includes("volver")) {
        atras();
      } else if (comando.includes("ayuda")) {
        await speak.hablar("Puedes decir confirmar, borrar o atrás");
      } else {
        await speak.hablar(
          "No entendí el comando. Di confirmar, borrar o atrás",
        );
      }
    } catch (error) {
      await speak.hablar("No te he entendido");
    } finally {
      setIsListening(false);
      isProcessing.current = false;

      setTimeout(() => {
        voice.startWake(activarAsistente);
      }, 1000);
    }
  }, [voice, speak, navigation]);

  const atras = () => {
    speak.detener();
    navigation.goBack();
  };

  const borrar = () => {
    setSelected([]);
    setFailedIds([]);
    setError("");
    setErrorValue(false);
  };

  const eliminarSeleccionada = (index: number) => {
    setSelected(selected.filter((_, i) => i !== index));
    setError("");
    setErrorValue(false);
  };

  const handleSelectedPress = (item: ImagePassword) => {
    if (selected.some((img) => img.id === item.id)) return;
    setSelected([...selected, item]);
  };

  const handleBorrarPress = () => borrar();

  const handleConfirmarPress = useCallback(async () => {
    if (!selectedRef.current.length) {
      setError("SELECCIONA LAS IMÁGENES");
      setErrorValue(true);
      return;
    }

    try {
      const response = await api.loginStudent(
        student.id,
        student.tipoContraseña,
        undefined,
        selectedRef.current,
      );

      if (!response.ok) {
        setError(response.message.toUpperCase());
        setErrorValue(true);
        if (response.fallos) setFailedIds(response.fallos);
        await speak.hablar("La contraseña no es correcta");
        return;
      }

      await setUser(student);
      if (student.asistenteVoz === "bidireccional") {
        await voice.stopWake();
        await voice.pauseListening();
      }
      navigation.navigate(
        student.preferenciasVisualizacion === "diarias"
          ? "DiariasScreem"
          : "MensualScreen",
      );
    } catch {
      setError("ERROR DE CONEXIÓN");
      setErrorValue(true);
    }
  }, [student, api, speak, setUser, navigation]);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const res = await api.getImagePassword(student.id);
        if (res.ok) setPassword(res.message);

        if (student.asistenteVoz !== "none" && !initializedRef.current) {
          initializedRef.current = true;
          await speak.hablar(`Hola ${student.username}.`);
          if (student.asistenteVoz === "bidireccional") {
            await speak.hablar("Me llamo Sofía. Soy tu asistente y te ayudaré");
            await speak.hablar(
              "Puedes llamarme por mi nombre y despues decir.",
            );
            await speak.hablar("Atrás para ir a la pantalla de atrás.");
            await speak.hablar("borrar si te has equivocado con tu contraseña");
            await speak.hablar("o confirmar para iniciar sesión");
            voice.startWake(activarAsistente);
          }
        }
      };

      init();
      return () => {
        voice.stopWake();
      };
    }, []),
  );

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const insets = useSafeAreaInsets();

  // ================= UI =================

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(28)}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          justifyContent: "space-evenly",
          paddingBottom: 10,
        }}
      >
        <View
          style={[
            styles.content,
            styles.shadow,
            {
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              paddingVertical: 5,
              borderRadius: 20,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: api.getFoto(student.foto) }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                borderWidth: 2,
                borderColor: "#FF8C42",
                marginRight: 15,
              }}
            />
            <View>
              <Text
                style={[
                  homeScreem_styles.studentCardUsername,
                  { marginBottom: 5, fontSize: scaleFont(18) },
                ]}
              >
                {student.username.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.content,
            styles.shadow,
            {
              height: 100,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFF",
              borderRadius: 15,
              padding: 10,
            },
          ]}
        >
          {selected.length === 0 ? (
            <Text
              style={{
                fontFamily: "escolar-bold",
                color: "#999",
              }}
            >
              SELECCIONA TU CLAVE...
            </Text>
          ) : (
            selected.map((item, index) => {
              const esFallida = failedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => eliminarSeleccionada(index)}
                  style={{ margin: 2, position: "relative" }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      borderWidth: esFallida ? 2 : 1,
                      borderColor: esFallida ? "red" : "#ddd",
                      opacity: esFallida ? 0.6 : 1,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "#FF3B30",
                      borderRadius: 10,
                      width: 18,
                      height: 18,
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </Text>
                  </View>
                  {esFallida && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 59, 48, 0.3)",
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 30,
                          fontWeight: "bold",
                          textShadowColor: "rgba(0,0,0,0.5)",
                          textShadowRadius: 2,
                        }}
                      >
                        ✕
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 200 }}>
          <FlatList
            columnWrapperStyle={{ justifyContent: "center", gap: 10 }}
            numColumns={3}
            scrollEnabled={false}
            data={password}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectedPress(item)}
                disabled={selected.some(
                  (selectedItem) => selectedItem.id === item.id,
                )}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 10,
                    margin: 2,
                    borderWidth: 2,
                    borderColor: selected.some(
                      (selectedItem) => selectedItem.id === item.id,
                    )
                      ? "#4CD964"
                      : "#EEE",
                    opacity: selected.some(
                      (selectedItem) => selectedItem.id === item.id,
                    )
                      ? 0.7
                      : 1,
                  }}
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {errorValue && (
          <View style={[styles.errorContainer]}>
            <Text style={[styles.error]}>{error}</Text>
          </View>
        )}

        <View style={[styles.navigationButtons, { paddingHorizontal: 0 }]}>
          <Boton uri="borrar" nameBottom="BORRAR" onPress={handleBorrarPress} />

          <Boton
            uri="ok"
            nameBottom="CONFIRMAR"
            onPress={handleConfirmarPress}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
