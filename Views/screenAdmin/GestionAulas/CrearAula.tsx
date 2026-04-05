import React, { useState } from "react";
import { scaleFont, styles } from "../../../styles/styles";
import Header from "../../../components/Header";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Boton from "../../../components/Boton";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { ActivityIndicator } from "react-native-paper";

function Splash() {
  return (
    <View style={[styles.content, styles.shadow]}>
      <ActivityIndicator size="large" color="#FF8C42" />
      <Text
        style={[
          styles.text_legend,
          {
            textAlign: "center",
            marginTop: 20,
            fontSize: scaleFont(18),
            fontWeight: "bold",
            color: "#333",
          },
        ]}
      >
        CREANDO EL AULA...
      </Text>
      <Text
        style={[
          styles.text,
          { fontSize: scaleFont(15), marginTop: 10, color: "#666" },
        ]}
      >
        POR FAVOR, ESPERE UN MOMENTO.
      </Text>
    </View>
  );
}
export default function CrearAula({ navigation }: { navigation: any }) {
  const [aulaName, setAulaName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const api = new ConnectApi();
  const atras = () => {
    navigation.goBack();
  };
  const handleAñadirPress = async () => {
    setError(false);
    setErrorValue("");
    setIsLoading(true);
    const success = await api.createAula(aulaName);
    if (success) {
      setTimeout(() => {
        setIsLoading(false);
        navigation.replace("GestionAulas");
      }, 2000);
    } else {
      setErrorValue("ERROR AL CREAR EL AULA. INTÉNTALO DE NUEVO.");
      setError(true);
    }
  };
  const handleChangePress = (text: string) => {
    setAulaName(text.toUpperCase());
  };
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="CREAR.AULA"
        uriPictograma="aula"
        style={scaleFont(30)}
      />
      {isLoading && <Splash />}
      {!isLoading && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.content, styles.shadow]}>
              <Text style={[styles.text_legend]}>NOMBRE DEL AULA:</Text>
              <TextInput
                style={[styles.buscador, { textAlign: "left" }]}
                placeholder="EJ: AULA 1"
                value={aulaName}
                onChangeText={handleChangePress}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
              />
            </View>
            {error && <Text style={[styles.error]}>{errorValue}</Text>}
            <Boton
              uri="ok"
              nameBottom="AÑADIR.AULA"
              onPress={handleAñadirPress}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaProvider>
  );
}
