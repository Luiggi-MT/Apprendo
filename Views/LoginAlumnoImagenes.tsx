import React, { use, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import { ApiResponse } from "../class/Interface/ApiResponse";
import Boton from "../components/Boton";
import { Speak } from "../class/Speak/Speak";
import { useFocusEffect } from "@react-navigation/native";
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

  const [password, setPassword] = useState<ApiResponse[]>([]);

  const [selected, setSelected] = useState<ApiResponse[]>([]);

  const atras = () => {
    speak.detenerAsistente();
    navigation.goBack();
  };

  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const getImage = async () => {
    try {
      const resCorrectas = await api.getImagePassword(true, student.id);
      const resDistractoras = await api.getImagePassword(false, student.id);

      const listaCorrectas = resCorrectas.ok ? resCorrectas.message : [];
      const listaDistractoras = resDistractoras.ok
        ? resDistractoras.message
        : [];

      const todasLasImagenes = [...listaCorrectas, ...listaDistractoras];

      const imagenesMezcladas = shuffleArray(todasLasImagenes);
      setPassword(imagenesMezcladas);
    } catch (error) {
      console.error("Error cargando imágenes de login:", error);
    }
  };

  const handleSelectedPress = (item: ApiResponse) => {
    const yaSeleccionada = selected.some((img) => img.uri === item.uri);

    if (yaSeleccionada) {
      return;
    }

    setSelected((prevSelected) => [...prevSelected, item]);
  };

  const eliminarSeleccionada = (index: number) => {
    setSelected((prevSelected) => {
      return prevSelected.filter((_, i) => i !== index);
    });
  };
  const handleBorrarPress = () => {
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
  useEffect(() => {
    if (student.tipoContraseña === "imagenes") {
      getImage();
    }
    speak.hablar(
      `Bienvenido ${student.username}. Estas en la pantalla para iniciar sesión.`,
      () => {
        speak.hablar(
          `Selecciona las imagenes de tu contraseña y a continuación presiona el botón de confirmar.`
        );
      }
    );
  }, []);

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="Atrás"
        navigation={() => atras()}
        nameHeader={api.getComponent("Entrar.png")}
        uriPictograma="entrar"
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
          style={[styles.imageTarjet, { borderWidth: 1 }]}
        />
        <Text style={styles.tesxtLegend}>{student.username}</Text>
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
          {selected.map((item, index) => (
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
                  borderWidth: 1,
                  borderColor: "#ddd",
                  opacity: 0.7,
                }}
              />
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
          ))}
          {selected.length === 0 && (
            <Text style={{ color: "#999" }}>Selecciona tu clave...</Text>
          )}
        </View>
      </View>
      <View style={styles.navigationButtons}>
        <Boton uri="borrar" nameBottom="Borrar" onPress={handleBorrarPress} />
        {student.asistenteVoz === 1 && (
          <Boton component={true} uri="Cohete.png" onPress={activarAsistente} />
        )}
        <Boton uri="ok" nameBottom="Confirmar" onPress={() => {}} />
      </View>
    </SafeAreaProvider>
  );
}
