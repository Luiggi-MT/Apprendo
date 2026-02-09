import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import Header from "../../components/Header";
import Boton from "../../components/Boton";
import { styles, scaleFont } from "../../styles/styles";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { Speak } from "../../class/Speak/Speak";
import { UserContext } from "../../class/context/UserContext";
import WakeWord from "../../class/WakeWord/WakeWord";
import { ImagePassword } from "../../class/Interface/ImagePassword";

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
  const isProcessing = useRef(false); // 🔴 CAMBIO: lock real
  const selectedRef = useRef<ImagePassword[]>([]);

  // ================= ASISTENTE =================

  const activarAsistente = useCallback(async () => {
    if (isProcessing.current) {
      console.log("⚠️ Asistente ocupado");
      return;
    }

    isProcessing.current = true;
    setIsListening(true);

    try {
      // 🔴 CAMBIO: hablar y ESPERAR
      await speak.hablar("Te escucho");

      console.log("🎯 Esperando comando...");

      // 🔴 CAMBIO CLAVE: el comando lo escucha WakeWord
      const comando = (await WakeWord.listenCommand()).toLowerCase();

      console.log("✅ Comando:", comando);

      if (comando.includes("confirmar")) {
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
      console.log("❌ Error comando:", error);
      await speak.hablar("No te he entendido");
    } finally {
      setIsListening(false);
      isProcessing.current = false;

      // 🔴 CAMBIO: volver a wake word
      setTimeout(() => {
        WakeWord.startWake(activarAsistente);
      }, 1000);
    }
  }, []);

  // ================= ACCIONES =================

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
    console.log("Selected en handleConfirmarPress: ", selected);
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

  // ================= INIT =================

  useEffect(() => {
    const init = async () => {
      const res = await api.getImagePassword(student.id);
      if (res.ok) setPassword(res.message);

      if (student.asistenteVoz !== "none" && !initializedRef.current) {
        initializedRef.current = true;
        await speak.hablar(
          `Hola ${student.username}. Di Sofía para activar el asistente`,
        );
        WakeWord.startWake(() => {
          console.log("🔔 WakeWord detectado");
          activarAsistente();
        });
      }
    };

    init();

    return () => {
      speak.detener();
    };
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // ================= UI =================

  return (
    <SafeAreaProvider style={styles.container}>
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
          paddingBottom: 8,
        }}
      >
        <View
          style={[
            styles.content,
            styles.shadow,
            {
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              paddingVertical: 15,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: api.getFoto(student.foto) }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: "#FF8C42",
                marginRight: 15,
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "escolar-bold",
                  fontSize: scaleFont(15),
                  color: "#333",
                }}
              >
                {student.username.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontFamily: "escolar-regular",
                  fontSize: scaleFont(12),
                  color: "#666",
                }}
              >
                Asistente: {student.asistenteVoz}
              </Text>
            </View>
          </View>

          {student.asistenteVoz !== "none" && (
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: isListening ? "#4CD964" : "#FF9500",
                  marginBottom: 4,
                  borderWidth: 2,
                  borderColor: isListening ? "#2ECC71" : "#FFF",
                }}
              />
              <Text
                style={{
                  fontFamily: "escolar-regular",
                  fontSize: scaleFont(10),
                  color: "#666",
                }}
              >
                {isListening ? "Escuchando" : "Listo"}
              </Text>
            </View>
          )}
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
          {student.asistenteVoz === "bidireccional" && (
            <Boton
              component={true}
              uri={isListening ? "microfono-off.png" : "microfono.png"}
              nameBottom={isListening ? "ESCUCHANDO..." : "ASISTENTE"}
              onPress={activarAsistente}
            />
          )}
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
