import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { Image, View, FlatList, Dimensions, Text } from "react-native";
import { scaleFont, styles } from "../../styles/styles";
import { BotonPin } from "../../class/Interface/BotonPin";
import BotonContraseña from "../../components/BotonContraseña";
import InputText from "../../components/InputText";
import Boton from "../../components/Boton";
import { Speak } from "../../class/Speak/Speak";
import { useFocusEffect } from "@react-navigation/native";
import { tarjetaDescipcion_styles } from "../../styles/tarjetaDescripcion_styles";
import { homeScreem_styles } from "../../styles/homeScreem_styles";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";

export default function LoginAlumnoPin({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;
  const speak = new Speak();
  const api = new ConnectApi();

  const windowWidth = Dimensions.get("window").width;
  const buttonWidth = Math.min(windowWidth / 2 - 15, 100);

  const opciones: BotonPin[] = [
    { id: "1", uriPictograma: "uno", nameBottom: "uno" },
    { id: "2", uriPictograma: "dos", nameBottom: "dos" },
    { id: "3", uriPictograma: "tres", nameBottom: "tres" },
    { id: "4", uriPictograma: "cuatro", nameBottom: "cuatro" },
    { id: "5", uriPictograma: "cinco", nameBottom: "cinco" },
    { id: "6", uriPictograma: "seis", nameBottom: "seis" },
    { id: "7", uriPictograma: "siete", nameBottom: "siete" },
    { id: "8", uriPictograma: "ocho", nameBottom: "ocho" },
    { id: "9", uriPictograma: "nueve", nameBottom: "nueve" },
    { id: "0", uriPictograma: "cero", nameBottom: "cero" },
  ];

  const [botonesPin, setBotonesPin] = useState<BotonPin[]>(opciones);
  const [pinValue, setPinValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [errorValue, setErrorValue] = useState<boolean>(false);
  const { user, setUser } = useContext(UserContext);

  const atras = () => {
    speak.detenerAsistente();
    navigation.goBack();
  };

  const handleBorrarPress = () => {
    setErrorValue(false);
    setError("");
    setPinValue("");
  };

  const handleNumberPress = (number: string) => {
    setPinValue((prev) => prev + number);
  };

  const activarAsistente = async () => {
    speak.hablar("Te escucho", async () => {
      const comando = await speak.procesarComandoVoz();
      if (comando.toLowerCase().includes("confirmar")) {
        speak.hablar("Has dicho confirmar");
      } else if (comando.toLocaleLowerCase().includes("borrar")) {
        speak.hablar("Se ha borrado el campo contraseña");
        setPinValue("");
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
    if (pinValue.length < 4) {
      setError("LA CONTRASEÑA TIENE QUE TENER 4 CARÁCTERES COMO MÍNIMO");
      if (student.asistenteVoz !== "none") {
        speak.hablar(
          "La contraseña tiene que tener 4 carácteres como mínimo.",
          () => {
            speak.hablar("Prueba de nuevo.");
          },
        );
      }
      setErrorValue(true);
      return;
    }
    const response = await api.loginStudent(
      student.id,
      student.tipoContraseña,
      pinValue,
    );
    if (!response.ok) {
      setErrorValue(true);
      setError(response.message.toUpperCase());
      if (student.asistenteVoz !== "none") {
        speak.hablar(
          "La contraseña que has introducido no es la correcta.",
          () => {
            speak.hablar("Intentalo de nuevo.");
          },
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

  console.log(JSON.stringify(student, null, 2));

  useEffect(() => {
    if (student.asistenteVoz !== "none") {
      speak.hablar(
        `Bienvenido ${student.username}. Estas en la pantalla para iniciar sesión.`,
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
        navigation={atras}
        nameHeader="ENTRAR"
        uriPictograma="entrar"
        style={scaleFont(36)}
      />
      <View
        style={[
          styles.content,
          styles.shadow,
          { justifyContent: "center", alignItems: "center", marginBottom: 10 },
        ]}
      >
        <Image
          source={{ uri: api.getFoto(student.foto) }}
          style={[tarjetaDescipcion_styles.imageTarjet, { borderWidth: 1 }]}
        />
        <Text style={homeScreem_styles.studentCardUsername}>
          {student.username}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <FlatList
          columnWrapperStyle={{ justifyContent: "center", margin: 1 }}
          numColumns={3}
          scrollEnabled={false}
          data={botonesPin}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: buttonWidth }}>
              <BotonContraseña
                uri={item.uriPictograma}
                onPress={() => handleNumberPress(item.id)}
              />
            </View>
          )}
        />
      </View>

      <View>
        <InputText
          placehorder="PIN"
          value={pinValue}
          input={setPinValue}
          secure={true}
          editable={false}
        />
      </View>
      {errorValue && (
        <View>
          <Text style={[styles.error]}>{error}</Text>
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
