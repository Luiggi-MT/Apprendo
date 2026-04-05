import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/styles";
import { Arasaac } from "../class/Arasaac/getPictograma";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { Speak } from "../class/Speak/Speak";

const PasoAula = ({
  uri = null,
  aula,
  accesibilidad,
}: {
  uri?: string | null;
  aula: any;
  accesibilidad: any;
}) => {
  const [mensaje, setMensaje] = useState<string>("");
  const arasaacService = new Arasaac();
  const api = new ConnectApi();
  const speak = Speak.getInstance();

  useEffect(() => {
    if (aula.aula.includes("ALMACEN")) {
      setMensaje(`IR AL ${aula.aula}`);
    } else {
      setMensaje(`REGRESAR AL AULA DE ${aula.username.toUpperCase()}`);
    }
    if (accesibilidad.includes("audio")) {
      speak.hablar(mensaje);
    }
  }, [aula, accesibilidad, mensaje]);
  return (
    <View style={stylesLocal.container}>
      {uri !== null && uri === "ir" && (
        <View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {aula !== null && aula.aula.includes("ALMACEN") ? (
              <Image
                source={{ uri: arasaacService.getPictograma("caminar") }}
                style={stylesLocal.imagen}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{ uri: arasaacService.getPictograma("regresar") }}
                style={stylesLocal.imagen}
                resizeMode="contain"
              />
            )}
            {aula !== null && aula.aula === "ALMACEN" ? (
              <Image
                source={{ uri: arasaacService.getPictograma("almacen") }}
                style={stylesLocal.imagen}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{ uri: api.getFoto(aula.foto) }}
                style={stylesLocal.imagen}
                resizeMode="contain"
              />
            )}
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {aula !== null && aula.aula.includes("ALMACEN") ? (
              <Text style={styles.text_legend}>{mensaje}</Text>
            ) : (
              <Text style={styles.text_legend}>{mensaje}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default PasoAula;

const stylesLocal = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF8C42",
    borderRadius: 10,
    height: 180,
    width: "90%",
    alignSelf: "center",
    padding: 10,
  },
  imagen: {
    width: 70,
    height: 70,
  },
});
