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
import { tarjetaDescipcion_styles } from "../../styles/tarjetaDescripcion_styles";
import AppbarContent from "react-native-paper/lib/typescript/components/Appbar/AppbarContent";
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

  const { user, setUser } = useContext(UserContext);

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
    const yaSeleccionada = selected.some((img) => img.uri === item.uri);

    if (yaSeleccionada) {
      return;
    }

    setSelected((prevSelected) => [...prevSelected, item]);
  };

  const eliminarSeleccionada = (index: number) => {
    setError("");
    setErrorValue(false);
    setSelected((prevSelected) => {
      return prevSelected.filter((_, i) => i !== index);
    });
  };
  const handleBorrarPress = () => {
    setErrorValue(false);
    setError("");
    setSelected([]);
  };

  const activarAsistente = async () => {
    speak.hablar("Te escucho", async () => {
      const comando = await speak.procesarComandoVoz();
      if (comando.toLowerCase().includes("confirmar")) {
        speak.hablar("Has dicho confirmar");
      } else if (comando.toLocaleLowerCase().includes("borrar")) {
        speak.hablar("Se ha borrado el campo contraseña");
        setSelected([]);
      } else if (comando.toLocaleLowerCase().includes("atrás")) {
        speak.hablar("Volviendo a la página de inicio");
        speak.detenerAsistente();
        navigation.goBack();
      } else {
        speak.hablar("Lo siento, no te he entendido");
      }
    });
  };

  const handleConfirmarPress = async () => {
    setErrorValue(false);
    setFailedIds([]);
    if (selected.length === 0) {
      setErrorValue(true);
      setError("SELECCIONA LAS IMAGENES DE TU CONTRASEÑA");
      if (student.asistenteVoz !== "none") {
        speak.hablar(
          "Selecciona las imagenes de tu contraseña y después presiona el botón de confirmar",
        );
      }
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
      if (response.fallos) {
        setFailedIds(response.fallos);
      }
      if (student.asistenteVoz !== "none") {
        speak.hablar(
          "La contraseña que has introducido no es la correcta. Intentalo de nuevo",
        );
      }
      return;
    }
    const studentLogin: Students = {
      id: student.id,
      username: student.username,
      foto: student.foto,
      tipoContraseña: student.tipoContraseña,
      accesibilidad: student.accesibilidad,
      preferenciasVisualizacion: student.preferenciasVisualizacion,
      asistenteVoz: student.asistenteVoz,
      sexo: student.sexo,
    };
    await setUser(studentLogin);

    if (studentLogin.preferenciasVisualizacion === "diarias")
      navigation.navigate("DiariasScreem");
    if (studentLogin.preferenciasVisualizacion === "semanales")
      //cambiar esto
      navigation.navigate("MensualScreen");
  };
  useEffect(() => {
    if (student.tipoContraseña === "imagenes") {
      getImage();
    }

    if (student.asistenteVoz !== "none") {
      speak.hablar(
        `${
          student.sexo === "masculino"
            ? "Bienvenido"
            : student.sexo === "femenino"
              ? "Bienvenida"
              : "Bienvenide"
        }  ${student.username}. Estas en la pantalla para iniciar sesión.`,
        () => {
          speak.hablar(
            `Escribe tu contraseña y a continuación presiona el botón de confirmar.`,
          );
        },
      );
    }
  }, [student]);

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(36)}
      />
      <View
        style={[
          styles.content,
          styles.shadow,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Image
          source={{ uri: api.getFoto(student.foto) }}
          style={[tarjetaDescipcion_styles.imageTarjet, { borderWidth: 1 }]}
        />
        <Text style={styles.text_legend}>{student.username}</Text>
      </View>
      <View>
        <FlatList
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 10,
            marginBottom: 10,
          }}
          numColumns={3}
          scrollEnabled={false}
          data={password}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectedPress(item)}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: 80, height: 80, borderRadius: 10, margin: 5 }}
              />
            </TouchableOpacity>
          )}
        />

        <View
          style={[
            styles.content,
            styles.shadow,
            {
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 80,
            },
          ]}
        >
          {selected.map((item, index) => {
            const esFallida = failedIds.includes(item.id);
            return (
              <View
                key={`${item.uri}-${index}`}
                style={{ position: "relative", margin: 5 }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    borderWidth: esFallida ? 3 : 1,
                    borderColor: esFallida ? "red" : "#ddd",
                    opacity: esFallida ? 0.5 : 0.7,
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
                        fontSize: 40,
                        fontWeight: "bold",
                        textShadowColor: "black",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      ✕
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => eliminarSeleccionada(index)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "red",
                    borderRadius: 12,
                    width: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {selected.length === 0 && (
            <Text style={[styles.text, { color: "#999" }]}>
              SELECCIONA TU CLAVE...
            </Text>
          )}
        </View>
      </View>
      {errorValue && (
        <View>
          <Text style={[styles.error, { margin: 10 }]}>{error}</Text>
        </View>
      )}
      <View style={styles.navigationButtons}>
        <Boton uri="borrar" nameBottom="BORRAR" onPress={handleBorrarPress} />
        {student.asistenteVoz === 1 && (
          <Boton component={true} uri="Cohete.png" onPress={activarAsistente} />
        )}
        <Boton uri="ok" nameBottom="CONFIRMAR" onPress={handleConfirmarPress} />
      </View>
    </SafeAreaProvider>
  );
}
