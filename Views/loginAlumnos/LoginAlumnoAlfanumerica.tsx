import React, { useContext, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { scaleFont, styles } from "../../styles/styles";
import InputText from "../../components/InputText";
import Boton from "../../components/Boton";
import Header from "../../components/Header";
import { Speak } from "../../class/Speak/Speak";
import { homeScreem_styles } from "../../styles/homeScreem_styles";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";
import { tarjetaDescipcion_styles } from "../../styles/tarjetaDescripcion_styles";

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
  const [error, setError] = useState<string[]>([]);
  const { user, setUser } = useContext(UserContext);
  const [errorValue, setErrorValue] = useState<boolean>(false);

  const errorMessage: string[] = [];

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

  const handleConfirmarPress = async () => {
    setErrorValue(false);
    setError([]);
    if (password === "")
      errorMessage.push("El campo contraseña no puede esta vacio");
    const response = await api.loginStudent(
      student.id,
      student.tipoContraseña,
      password,
    );
    if (!response.ok) {
      console.log(JSON.stringify(response, null, 2));
      errorMessage.push(response.message.toUpperCase());
    }
    if (errorMessage.length > 0) {
      setErrorValue(true);
      setError(errorMessage);
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
        nameBottom="ATRÁS"
        navigation={() => atras()}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(36)}
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
            style={[tarjetaDescipcion_styles.imageTarjet, { borderWidth: 1 }]}
          />
          <Text style={homeScreem_styles.studentCardUsername}>
            {student.username.toUpperCase()}
          </Text>
        </View>
        <InputText
          placehorder="CONTRASEÑA"
          value={password}
          input={handleContraseñaPress}
          secure={true}
        />
        {errorValue && (
          <View>
            <Text style={[styles.error, { margin: 10 }]}>{error}</Text>
          </View>
        )}
        <View style={styles.navigationButtons}>
          <Boton uri="borrar" nameBottom="BORRAR" onPress={handleBorrarPress} />
          <Boton
            uri="ok"
            nameBottom="CONFIRMAR"
            onPress={handleConfirmarPress}
          />
        </View>
        {student.asistenteVoz === "bidireccional" && (
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
