import React, { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as Speech from "expo-speech";
import { Audio } from "expo-av";

import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { styles } from "../styles/styles";
import InputText from "../components/InputText";
import Boton from "../components/Boton";
import Header from "../components/Header";

export default function LoginAlumnoAlfanumerica({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;
  const api = new ConnectApi();
  const [password, setPassword] = useState<string>("");
  const recordingRef = useRef<Audio.Recording | null>(null);

  const hablar = (texto: string, onDone?: () => void) => {
    Speech.speak(texto, {
      language: "es-ES",
      rate: 0.9,
      pitch: 1.0,
      onDone: onDone,
    });
  };

  const handleContraseñaPress = (inputContraseña: string) => {
    setPassword(inputContraseña);
  };
  const handleBorrarPress = () => {
    setPassword("");
  };

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();
    recordingRef.current = recording;
  };

  const stopRecording = async () => {
    const recording = recordingRef.current;
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recordingRef.current = null;
    return uri;
  };

  const atras = () => {
    navigation.goBack();
  };

  const procesarComandoVoz = async () => {
    await startRecording();
    setTimeout(async () => {
      const uri = await stopRecording();
      if (!uri) return;
      const texto = await api.enviarAudio(uri);
      console.log(texto);
      if (
        texto.toLowerCase().includes("confirmar") ||
        texto.toLowerCase.includes("confirmado")
      ) {
        hablar("Has dicho confirmar");
      } else if (texto.toLowerCase().includes("borrar")) {
        setPassword("");
      } else if (texto.toLowerCase().includes("atrás")) {
        hablar("Volviendo a la página de inicio");
        Speech.stop();
        navigation.goBack();
      } else {
        hablar("Lo siento, no te he entendido");
      }
    }, 4000);
  };
  const activarAsistente = async () => {
    hablar("Te escucho", async () => {
      await procesarComandoVoz();
    });
  };

  useEffect(() => {
    if (student.asistenteVoz) {
      hablar(
        `Bienvenido ${student.username}. Estas en la pantalla para iniciar sesión.`,
        () => {
          hablar(
            `Escribe tu contraseña y a continuación presiona el botón de confirmar.`
          );
        }
      );
    }
  }, []);
  useFocusEffect(() => {
    return () => {
      Speech.stop();
    };
  });
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
        <Text style={styles.studentCardUsername}>{student.username}</Text>
      </View>
      <InputText
        placehorder="Contraseña"
        value={password}
        input={handleContraseñaPress}
        secure={true}
      />
      <View style={styles.navigationButtons}>
        <Boton uri="borrar" nameBottom="Borrar" onPress={handleBorrarPress} />
        <Boton uri="ok" nameBottom="Confirmar" onPress={() => {}} />
      </View>
      <View>
        <Boton component={true} uri="Cohete.png" onPress={activarAsistente} />
      </View>
    </SafeAreaProvider>
  );
}
