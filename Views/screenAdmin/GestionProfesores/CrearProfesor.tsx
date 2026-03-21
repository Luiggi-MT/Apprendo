import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { Text, TextInput, View } from "react-native";
import { shadow } from "react-native-paper";
import Boton from "../../../components/Boton";
import Splash from "../../../components/Splash";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
export default function CrearProfesor({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState<string>("");
  const [palabraClave, setPalabraCalve] = useState<string>("PROFESOR");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<string>("");

  const api = new ConnectApi();

  const handlePalabraClaveChange = (word: string) => {
    setPalabraCalve(word);
  };
  const handleUsernameChange = (word: string) => {
    setUsername(word.toUpperCase());
  };
  const handleAñadirProfesorPress = () => {
    setError(false);
    setErrorValue("");
    if (username.length === 0) {
      setError(true);
      setErrorValue("EL CAMPO USUARIO NO PUEDE ESTAR VACIO");
      return;
    }
    if (palabraClave.length === 0) {
      setError(true);
      setErrorValue("EL CAMPO PALABRA CLAVE NO PUEDE ESTAR VACIO");
      return;
    }
    api.createProfesor(username, palabraClave).then((response) => {
      if (response) {
        setTimeout(() => {
          setIsloading(false);
          navigation.goBack();
        }, 2000);
      }
    });
  };
  const atras = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="CREAR.PROFESOR"
        uriPictograma="profesor"
        style={scaleFont(25)}
      />
      {isLoading && <Splash name="CREANDO AL PROFESOR" />}
      {!isLoading && (
        <>
          <View style={[styles.content, styles.shadow]}>
            <Text style={[styles.text_legend]}>USUARIO:</Text>
            <TextInput
              style={[styles.buscador]}
              onChangeText={handleUsernameChange}
              value={username}
              placeholder="INTRODUCIR NOMBRE DE USUARIO"
            />
            <Text style={[styles.text_legend]}>PALABRA CLAVE:</Text>
            <TextInput
              style={[styles.buscador]}
              onChangeText={handlePalabraClaveChange}
              value={palabraClave}
              placeholder="INTRODUCIR PALABRA CLAVE"
            />
          </View>
          {error && <Text style={[styles.error]}>{errorValue}</Text>}
          <View style={[styles.bottomContainerHeder, { alignItems: "center" }]}>
            <Boton
              nameBottom="AÑADIR.PROFESOR"
              uri="ok"
              onPress={handleAñadirProfesorPress}
            />
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
}
