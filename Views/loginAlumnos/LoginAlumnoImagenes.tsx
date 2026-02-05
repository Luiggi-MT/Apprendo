import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { scaleFont, styles } from "../../styles/styles";
import { ApiResponse } from "../../class/Interface/ApiResponse";
import Boton from "../../components/Boton";
import { Speak } from "../../class/Speak/Speak";
import { useFocusEffect } from "@react-navigation/native";
import { ImagePassword } from "../../class/Interface/ImagePassword";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";

export default function LoginAlumnoImagenes({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;
  const api = new ConnectApi();
  const speak = new Speak();

  const [password, setPassword] = useState<ImagePassword[]>([]);
  const [selected, setSelected] = useState<ImagePassword[]>([]);
  const [failedIds, setFailedIds] = useState<number[]>([]);

  const [error, setError] = useState<string>("");
  const [errorValue, setErrorValue] = useState<boolean>(false);

  const { setUser } = useContext(UserContext);

  const atras = () => {
    speak.detenerAsistente();
    navigation.goBack();
  };

  const getImage = async () => {
    try {
      const response: ApiResponse = await api.getImagePassword(student.id);
      if (response.ok && Array.isArray(response.message)) {
        setPassword(response.message);
      }
    } catch (error) {
      console.error("Error cargando imágenes de login:", error);
    }
  };

  const handleSelectedPress = (item: ImagePassword) => {
    if (selected.some((img) => img.uri === item.uri)) return;
    setSelected((prevSelected) => [...prevSelected, item]);
  };

  const eliminarSeleccionada = (index: number) => {
    setError("");
    setErrorValue(false);
    setSelected((prevSelected) => prevSelected.filter((_, i) => i !== index));
  };

  const handleBorrarPress = () => {
    setErrorValue(false);
    setError("");
    setSelected([]);
    setFailedIds([]);
  };

  const activarAsistente = async () => {
    speak.hablar("Te escucho", async () => {
      const comandoEscuchado = await speak.procesarComandoVoz();
      const comando = comandoEscuchado.toLowerCase();
      if (comando.includes("confirmar")) {
        handleConfirmarPress();
      } else if (comando.includes("borrar")) {
        handleBorrarPress();
      } else if (comando.includes("atrás")) {
        atras();
      }
    });
  };

  const handleConfirmarPress = async () => {
    setErrorValue(false);
    setFailedIds([]);
    if (selected.length === 0) {
      setErrorValue(true);
      setError("SELECCIONA LAS IMÁGENES");
      return;
    }
    const response = await api.loginStudent(
      student.id,
      student.tipoContraseña,
      undefined,
      selected,
    );
    if (!response.ok) {
      setError(response.message.toUpperCase());
      setErrorValue(true);
      if (response.fallos) setFailedIds(response.fallos);
      if (student.asistenteVoz !== "none") {
        speak.hablar("La contraseña no es correcta. Inténtalo de nuevo");
      }
      return;
    }
    await setUser(student);
    navigation.navigate(
      student.preferenciasVisualizacion === "diarias"
        ? "DiariasScreem"
        : "MensualScreen",
    );
  };

  useEffect(() => {
    getImage();
    if (student.asistenteVoz !== "none") {
      speak.hablar(
        `Hola ${student.username}. Selecciona las imágenes de tu contraseña.`,
      );
    }
  }, []);

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
            },
          ]}
        >
          <Image
            source={{ uri: api.getFoto(student.foto) }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: "#FF8C42",
            }}
          />
          <Text
            style={{
              fontFamily: "escolar-bold",
              fontSize: scaleFont(15),
              marginTop: 5,
            }}
          >
            {student.username.toUpperCase()}
          </Text>
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
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontSize: 35,
                          fontWeight: "bold",
                          textShadowColor: "black",
                          textShadowRadius: 1,
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
              <TouchableOpacity onPress={() => handleSelectedPress(item)}>
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 10,
                    margin: 2,
                    borderWidth: 1,
                    borderColor: "#EEE",
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
              uri="Cohete.png"
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
