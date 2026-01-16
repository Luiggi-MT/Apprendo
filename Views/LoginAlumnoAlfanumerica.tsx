import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { styles } from "../styles/styles";
import InputText from "../components/InputText";
import Boton from "../components/Boton";
import Header from "../components/Header";
import { Speak } from "../class/Speak/Speak";

export default function LoginAlumnoAlfanumerica({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;
  const api = new ConnectApi();
  const speak = new Speak();

  const [password, setPassword] = useState<string>("");

  const handleContraseñaPress = (inputContraseña: string) => {
    setPassword(inputContraseña);
  };
  const handleBorrarPress = () => {
    setPassword("");
  };

  const atras = () => {
    speak.detenerAsistente();
    navigation.goBack();
  };

  const activarAsistente = async () => {
    speak.hablar("Te escucho", async () => {
      const comando = await speak.procesarComandoVoz();
      if (comando.toLowerCase().includes("confirmar")) {
        speak.hablar("Has dicho confirmar");
      } else if (comando.toLocaleLowerCase().includes("borrar")) {
        speak.hablar("Se ha borrado el campo contraseña");
        setPassword("");
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
    speak.hablar(
      `Bienvenido ${student.username}. Estas en la pantalla para iniciar sesión.`,
      () => {
        speak.hablar(
          `Escribe tu contraseña y a continuación presiona el botón de confirmar.`
        );
      }
    );
  }, []);
  useFocusEffect(() => {
    return () => {
      speak.detenerAsistente();
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
      <View style={{ flex: 1, width: "100%", paddingHorizontal: 10 }}>
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
        {student.asistenteVoz === 1 && (
          <View>
            <Boton
              component={true}
              uri="Cohete.png"
              onPress={activarAsistente}
            />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}
