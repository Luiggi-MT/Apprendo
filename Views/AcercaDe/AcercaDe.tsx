import React, { useState } from "react";
import { View, Text, ScrollView, Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { scaleFont, styles } from "../../styles/styles";
import Boton from "../../components/Boton";

export default function AcercaDe({ navigation }: { navigation: any }) {
  const [view, setView] = useState(0);
  const atrasHeader = () => navigation.goBack();

  // Función para abrir la URL externa
  const openArasaac = () => {
    Linking.openURL("http://www.arasaac.org").catch((err) =>
      console.error("ERROR AL ABRIR LA WEB:", err),
    );
  };

  const openPlayFunLearning = () => {
    Linking.openURL(
      "https://playfunlearning.es/fuentes-y-tipografias-escolares/",
    ).catch((err) => console.error("ERROR AL ABRIR LA WEB:", err));
  };

  const renderContent = () => {
    switch (view) {
      case 0:
        return (
          <View>
            <Text
              style={[
                styles.text_legend,
                { fontSize: 22, textAlign: "center", marginBottom: 20 },
              ]}
            >
              INFORMACIÓN DEL PROYECTO
            </Text>

            <Text
              style={[styles.text, { textAlign: "justify", marginBottom: 15 }]}
            >
              <Text style={styles.text_legend}>PROYECTA</Text> ES UNA APLICACIÓN
              DESARROLLADA CON EL OBJETIVO DE MEJORAR LA COMUNICACIÓN Y
              ORGANIZACIÓN EN ENTORNOS EDUCATIVOS, CON UN ENFOQUE ESPECIAL EN LA
              ACCESIBILIDAD COGNITIVA. ESTA HERRAMIENTA ESTÁ DISEÑADA PARA SER
              INTUITIVA Y FÁCIL DE USAR, FACILITANDO LA GESTIÓN DIARIA TANTO
              PARA PROFESORES COMO PARA ESTUDIANTES.
            </Text>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#EEE",
                marginVertical: 10,
              }}
            />

            <Text style={styles.text_legend}>SÍMBOLOS Y PICTOGRAMAS:</Text>
            <Text style={[styles.text, { textAlign: "left", marginTop: 5 }]}>
              LOS SÍMBOLOS PICTOGRÁFICOS UTILIZADOS EN ESTA APLICACIÓN SON
              PROPIEDAD DEL GOBIERNO DE ARAGÓN Y HAN SIDO CREADOS POR SERGIO
              PALAO PARA ARASAAC (
              <Text
                style={{ color: "#4C80D7", textDecorationLine: "underline" }}
                onPress={openArasaac}
              >
                HTTP://WWW.ARASAAC.ORG
              </Text>
              ), QUE LOS DISTRIBUYE BAJO LICENCIA CREATIVE COMMONS BY-NC-SA.
            </Text>
          </View>
        );
      case 1:
        return (
          <View>
            <Text
              style={[
                styles.text_legend,
                { fontSize: 22, textAlign: "center", marginBottom: 20 },
              ]}
            >
              CRÉDITOS TÉCNICOS
            </Text>

            <Text style={styles.text_legend}>TIPOGRAFÍA ESCOLAR:</Text>
            <Text style={[styles.text, { textAlign: "left", marginTop: 5 }]}>
              LA FUENTE ESCOLAR UTILIZADA EN ESTA INTERFAZ ES OBRA DE{" "}
              <Text
                style={{
                  fontFamily: "fredoka",
                  fontWeight: "light",
                }}
              >
                ©
              </Text>{" "}
              ANTONIO HERRERA INFANTES{" "}
              <Text
                style={{
                  fontFamily: "fredoka",
                  fontWeight: "light",
                }}
              >
                &
              </Text>{" "}
              ANYE1992, DISEÑADA ESPECÍFICAMENTE PARA FACILITAR LA LECTURA EN
              ETAPAS DE APRENDIZAJE DESCARGADA DESDE LA PÁGINA WEB DE (
              <Text
                style={{ color: "#4C80D7", textDecorationLine: "underline" }}
                onPress={openPlayFunLearning}
              >
                {"https://playfunlearning.es/fuentes-y-tipografias-escolares/".toUpperCase()}
              </Text>
              )
            </Text>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#EEE",
                marginVertical: 10,
              }}
            />

            <Text style={[styles.text_legend, { marginTop: 10 }]}>
              OTRAS FUENTES:
            </Text>
            <Text style={[styles.text, { textAlign: "left", marginTop: 5 }]}>
              SE UTILIZA LA TIPOGRAFÍA "FREDOKA", DESCARGADA DE GOOGLE FONTS Y
              DISPONIBLE BAJO LA OPEN FONT LICENSE.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atrasHeader}
        nameHeader="ACERCA.DE"
        uriPictograma="arasaacLogo"
        style={scaleFont(30)}
      />

      <View style={[styles.content, styles.shadow, { flex: 1 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>

        <View style={styles.navigationButtons}>
          <Boton uri="atras" onPress={() => setView(0)} dissable={view === 0} />
          <Boton
            uri="delante"
            onPress={() => setView(1)}
            dissable={view === 1}
          />
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerTextMain}>
          © {new Date().getFullYear()} PROYECTA
        </Text>
        <Text style={styles.footerTextSub}>DESARROLLADO POR LUIGGI.MT</Text>
      </View>
    </SafeAreaProvider>
  );
}
