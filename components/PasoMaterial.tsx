import { View, Text, Image, StyleSheet } from "react-native";
import React, { use, useEffect, useState } from "react";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { styles } from "../styles/styles";
import { VideoView, useVideoPlayer } from "expo-video";
import { Speak } from "../class/Speak/Speak";
import { Arasaac } from "../class/Arasaac/getPictograma";

const PasoMaterial = ({
  material,
  accesibilidad,
}: {
  material: any;
  accesibilidad: any;
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const api = new ConnectApi();
  const arasaacService = new Arasaac();
  const speak = Speak.getInstance();
  const player = useVideoPlayer(
    selectedVideo ? { uri: api.getMedia(selectedVideo) } : null,
    (player) => {
      player.loop = false;
    },
  );
  useEffect(() => {
    if (!material) return;
    const nombre = material.nombre.toUpperCase();
    const cantidad = material.cantidad;
    const PREPOSICIONES = new Set([
      "DE",
      "DEL",
      "CON",
      "SIN",
      "PARA",
      "POR",
      "EN",
      "A",
      "AL",
      "ANTE",
      "SOBRE",
      "TRAS",
      "ENTRE",
      "DESDE",
      "HASTA",
    ]);
    const pluralizar = (palabra: string): string => {
      if (palabra.endsWith("Z")) return palabra.slice(0, -1) + "CES";
      if (palabra.endsWith("S")) return palabra;
      if (/[AEIOUÁÉÍÓÚ]$/.test(palabra)) return palabra + "S";
      return palabra + "ES";
    };
    const nombrePlural =
      cantidad > 1
        ? (() => {
            const palabras = nombre.split(" ");
            let pluralizando = true;
            return palabras
              .map((p) => {
                if (PREPOSICIONES.has(p)) pluralizando = false;
                return pluralizando ? pluralizar(p) : p;
              })
              .join(" ");
          })()
        : nombre;
    // Artículo: "UN" (masculino) o "UNA" (femenino) cuando cantidad=1
    // Heurística: primera palabra termina en "A" → femenino
    const primeraPalabra = nombre.split(" ")[0];
    const esFemenino =
      primeraPalabra.endsWith("A") &&
      !primeraPalabra.endsWith("MA") &&
      !primeraPalabra.endsWith("PA");
    const cantidadTexto =
      cantidad === 1 ? (esFemenino ? "UNA" : "UN") : String(cantidad);
    const textoMensaje = `RECOGER ${cantidadTexto} ${nombrePlural}`;
    setMensaje(textoMensaje);
    setSelectedVideo(material.video);
    setSelectedImage(material.imagen);
    if (accesibilidad.includes("audio")) {
      speak.hablar(textoMensaje);
    }
  }, [material, accesibilidad]);

  if (!material) return null;

  return (
    <View style={localStyles.container}>
      {accesibilidad.includes("video") && material.video ? (
        <VideoView player={player} style={localStyles.video} />
      ) : accesibilidad.includes("imagenes") && material.imagen ? (
        <Image
          source={{ uri: api.getMedia(selectedImage) }}
          style={localStyles.imagen}
          resizeMode="contain"
        />
      ) : (
        accesibilidad.includes("pictogramas") &&
        material.pictogramaId && (
          <Image
            source={{
              uri: arasaacService.getPictogramaId(material.pictogramaId),
            }}
            style={localStyles.imagen}
            resizeMode="contain"
          />
        )
      )}
      <Text style={[styles.text_legend, localStyles.texto]}>{mensaje}</Text>
    </View>
  );
};

export default PasoMaterial;

const localStyles = StyleSheet.create({
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
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  video: {
    width: "100%",
    height: 120,
    marginBottom: 10,
  },
  texto: {
    textAlign: "center",
  },
});
