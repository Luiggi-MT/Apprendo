import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Header from "../../components/Header";
import Boton from "../../components/Boton";
import { scaleFont, styles } from "../../styles/styles";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import Splash from "../../components/Splash";

export default function OlvideContraseña({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState<string>("");
  const [palabraClave, setPalabraClave] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [repetirContraseña, setRepetirContraseña] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<string>("");

  const api = new ConnectApi();

  const atras = () => navigation.goBack();

  const handleRecuperar = async () => {
    setError(false);
    setErrorValue("");

    // Validación de campos vacíos
    if (!username || !palabraClave || !contraseña || !repetirContraseña) {
      setError(true);
      setErrorValue("TODOS LOS CAMPOS SON OBLIGATORIOS");
      return;
    }
    if (contraseña !== repetirContraseña) {
      setError(true);
      setErrorValue("LAS CONTRASEÑAS NO COINCIDEN");
      return;
    }
    if (contraseña.length < 4) {
      setError(true);
      setErrorValue("MÍNIMO 4 CARACTERES");
      return;
    }

    setLoading(true);
    api.setContraseña(username, contraseña, palabraClave).then((response) => {
      if (!response.ok) {
        setLoading(false);
        setError(true);
        setErrorValue(response.message.toUpperCase());
        return;
      }
      setTimeout(() => {
        setLoading(false);
        navigation.goBack();
      }, 2000);
    });
  };
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="RECUPERAR"
        uriPictograma="olvideContraseña"
        style={scaleFont(24)}
      />

      {loading && <Splash name="ESTABLECIENDO CONTRASEÑA" />}

      {!loading && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                {/* CONTENEDOR TIPO TARJETA (Gris Suave) */}
                <View
                  style={[
                    styles.content,
                    styles.shadow,
                    {
                      backgroundColor: "#F5F5F5",
                      borderRadius: 20,
                      paddingVertical: 20,
                      marginTop: 10,
                    },
                  ]}
                >
                  {/* USUARIO */}
                  <Text style={styles.text_legend}>NOMBRE DE USUARIO:</Text>
                  <TextInput
                    style={[
                      styles.buscador,
                      { backgroundColor: "#FFF", height: 50, marginBottom: 15 },
                    ]}
                    value={username}
                    onChangeText={(t) => setUsername(t.toUpperCase())}
                    placeholder="EJ: JUAN123"
                    autoCapitalize="characters"
                  />

                  {/* PALABRA CLAVE */}
                  <Text style={styles.text_legend}>PALABRA CLAVE:</Text>
                  <TextInput
                    style={[
                      styles.buscador,
                      { backgroundColor: "#FFF", height: 50, marginBottom: 15 },
                    ]}
                    value={palabraClave}
                    onChangeText={setPalabraClave}
                    placeholder="PALABRA DE SEGURIDAD"
                    secureTextEntry={true}
                  />

                  {/* NUEVA CONTRASEÑA */}
                  <Text style={styles.text_legend}>NUEVA CONTRASEÑA:</Text>
                  <TextInput
                    style={[
                      styles.buscador,
                      { backgroundColor: "#FFF", height: 50, marginBottom: 15 },
                    ]}
                    value={contraseña}
                    onChangeText={setContraseña}
                    placeholder="****"
                    secureTextEntry={true}
                  />

                  {/* REPETIR CONTRASEÑA */}
                  <Text style={styles.text_legend}>REPETIR CONTRASEÑA:</Text>
                  <TextInput
                    style={[
                      styles.buscador,
                      { backgroundColor: "#FFF", height: 50 },
                    ]}
                    value={repetirContraseña}
                    onChangeText={setRepetirContraseña}
                    placeholder="****"
                    secureTextEntry={true}
                  />

                  {/* MENSAJE DE ERROR */}
                  {error && (
                    <View
                      style={{
                        backgroundColor: "#FFEBEE",
                        marginTop: 15,
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={[styles.error, { fontSize: 13 }]}>
                        {errorValue}
                      </Text>
                    </View>
                  )}
                </View>

                {/* BOTÓN DE ACCIÓN */}
                <View style={{ marginTop: 25, alignItems: "center" }}>
                  <Boton
                    nameBottom="CAMBIAR.CONTRASEÑA"
                    uri="ok"
                    onPress={handleRecuperar}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaProvider>
  );
}
