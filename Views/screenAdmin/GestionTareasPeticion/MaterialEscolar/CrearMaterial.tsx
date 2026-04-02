import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import ColorPicker from "../../../../components/ColorPicker";
import Boton from "../../../../components/Boton";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import Splash from "../../../../components/Splash";
import { VideoView, useVideoPlayer } from "expo-video";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { MaterialEscolarSend } from "../../../../class/Interface/MaterialEscolarSend";

const COLORS: [string, string, ...string[]] = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];

const CrearMaterial = ({ navigation }: { navigation: any }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [view, setView] = useState<number>(0);
  const [materialId, setMaterialId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number | null>(null);
  const [forma, setForma] = useState<string>("");
  const [tamaño, setTamaño] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [videoSend, setVideoSend] = useState<string>("");

  const api = new ConnectApi();
  const arasaacService = new Arasaac();
  const imageMediaType =
    (ImagePicker as any)["MediaType"]?.Images ??
    ImagePicker.MediaTypeOptions.Images;
  const videoMediaType =
    (ImagePicker as any)["MediaType"]?.Videos ??
    ImagePicker.MediaTypeOptions.Videos;

  const player = useVideoPlayer(
    selectedVideo ? { uri: selectedVideo } : null,
    (player) => {
      player.loop = false;
    },
  );

  const handleNombreChange = (text: string) => {
    setNombre(text);
  };

  const handleAtrasPress = () => {
    setView(view - 1);
  };

  const handleSiguientePress = () => {
    setView(view + 1);
  };
  const handleCantidadChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      setCantidad(num);
    } else {
      setCantidad(null);
    }
  };
  const handleFormaChange = (text: string) => {
    setForma(text);
  };
  const handleTamañoChange = (text: string) => {
    setTamaño(text);
  };
  const handleAñadirPress = (tipo: string) => {
    navigation.navigate("AñadirPictograma", {
      tipoParam: tipo,
      onSelect: (id: number, tipoAsignado: string) => {
        if (tipoAsignado === "material") {
          setMaterialId(id);
        }
      },
    });
  };

  const seleccionarDesdeGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Se necesitan permisos para acceder a la galería de imágenes.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: imageMediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setSelectedImage(base64Image);
    }
  };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setError("Se necesitan permisos para acceder a la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: imageMediaType,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setSelectedImage(base64Image);
    }
  };

  const seleccionarVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Se necesitan permisos para acceder a la galería de videos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: videoMediaType,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const videoUri = result.assets[0].uri;
      try {
        const videoFile = new File(videoUri);
        const base64Video = await videoFile.base64();

        if (!base64Video) {
          setError("NO SE PUDO LEER EL VIDEO. INTENTA CON OTRO ARCHIVO.");
          setSelectedVideo("");
          setVideoSend("");
          return;
        }

        setError("");
        setSelectedVideo(videoUri);
        setVideoSend(`data:video/mp4;base64,${base64Video}`);
      } catch (e) {
        setError("NO SE PUDO LEER EL VIDEO. INTENTA CON OTRO ARCHIVO.");
        setSelectedVideo("");
        setVideoSend("");
      }
    }
  };

  const handleCreaPress = async () => {
    setError("");
    setIsCreate(true);
    if (
      selectedColor === null ||
      nombre === "" ||
      materialId === 0 ||
      cantidad === null ||
      forma === "" ||
      tamaño === "" ||
      selectedImage === "" ||
      videoSend === ""
    ) {
      setError("TODOS LOS CAMPOS SON OBLIGATORIOS.");
      setIsCreate(false);
      return;
    }

    setError("");
    const materialDataSend: MaterialEscolarSend = {
      nombre: nombre.toLowerCase(),
      color: selectedColor,
      pictogramaId: materialId,
      cantidad: cantidad,
      forma: forma.toLowerCase(),
      tamaño: tamaño.toLowerCase(),
      imagen: selectedImage,
      video: videoSend,
    };
    const response = await api.createMaterialEscolar(materialDataSend);
    if (response !== null) {
      setError(response.toUpperCase());
      setIsCreate(false);
      return;
    }
    setTimeout(() => {
      setIsCreate(false);
      navigation.goBack();
    }, 2000);
  };
  const atras = () => navigation.goBack();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="CREAR.MATERIAL"
        uriPictograma="materialEscolar"
        style={scaleFont(26)}
      />
      {isCreate ? (
        <Splash name="CREANDO EL MATERIAL" />
      ) : (
        <>
          <View style={[styles.content, styles.shadow]}>
            {view === 0 && (
              <View>
                <Text style={[styles.text_legend]}>NOMBRE DEL MATERIAL:</Text>
                <TextInput
                  style={[
                    styles.buscador,
                    styles.shadow,
                    { textAlign: "left", paddingHorizontal: 15, height: 50 },
                  ]}
                  placeholder="EJ: LÁPIZ, CUADERNO, REGLA..."
                  onChangeText={handleNombreChange}
                  value={nombre}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                <Text style={[styles.text_legend, { marginTop: 20 }]}>
                  COLOR
                </Text>
                <ColorPicker
                  colors={COLORS}
                  initialColor={selectedColor}
                  onChange={setSelectedColor}
                />
              </View>
            )}
            {view === 1 && (
              <View>
                <Text style={[styles.text_legend]}>PICTOGRAMA: </Text>
                <TouchableOpacity
                  style={{ marginTop: 15 }}
                  onPress={() => handleAñadirPress("material")}
                >
                  <Image
                    source={{ uri: arasaacService.getPictogramaId(materialId) }}
                    style={[
                      styles.imageBase,
                      { borderWidth: 1, borderRadius: 5 },
                    ]}
                  />
                </TouchableOpacity>
                <Text style={[styles.text_legend, { marginTop: 20 }]}>
                  CANTIDAD:
                </Text>
                <TextInput
                  style={[
                    styles.buscador,
                    styles.shadow,
                    { textAlign: "left", paddingHorizontal: 15, height: 50 },
                  ]}
                  placeholder="EJ: 1, 2, 3..."
                  onChangeText={handleCantidadChange}
                  value={cantidad !== null ? cantidad.toString() : ""}
                  keyboardType="numeric"
                />
                <Text style={[styles.text_legend, { marginTop: 20 }]}>
                  FORMA:
                </Text>
                <TextInput
                  style={[
                    styles.buscador,
                    styles.shadow,
                    { textAlign: "left", paddingHorizontal: 15, height: 50 },
                  ]}
                  placeholder="EJ: CUADRADO, CÍRCULO..."
                  onChangeText={handleFormaChange}
                  value={forma}
                  autoCapitalize="characters"
                />
                <Text style={[styles.text_legend, { marginTop: 20 }]}>
                  TAMAÑO:
                </Text>
                <TextInput
                  style={[
                    styles.buscador,
                    styles.shadow,
                    { textAlign: "left", paddingHorizontal: 15, height: 50 },
                  ]}
                  placeholder="EJ: PEQUEÑO, MEDIANO, GRANDE..."
                  onChangeText={handleTamañoChange}
                  value={tamaño}
                  autoCapitalize="characters"
                />
              </View>
            )}
            {view === 2 && (
              <View>
                <Text style={[styles.text_legend]}>FOTO:</Text>
                {selectedImage === "" && (
                  <>
                    <View style={stylesLocal.imageSourceRow}>
                      <TouchableOpacity
                        style={stylesLocal.imageSourceBtn}
                        onPress={seleccionarDesdeGaleria}
                      >
                        <Text style={stylesLocal.imageSourceBtnText}>
                          🖼 GALERÍA
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={stylesLocal.imageSourceBtn}
                        onPress={tomarFoto}
                      >
                        <Text style={stylesLocal.imageSourceBtnText}>
                          📷 CÁMARA
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {selectedImage !== "" && (
                  <View style={stylesLocal.imageContainer}>
                    <Image
                      style={styles.imageBase}
                      source={{ uri: selectedImage }}
                    />
                    <TouchableOpacity
                      style={[
                        stylesLocal.deleteCircleBtn,
                        { top: -10, right: -10 },
                      ]}
                      onPress={() => setSelectedImage("")}
                    >
                      <Text style={stylesLocal.deleteCircleBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={[styles.text_legend, { marginTop: 20 }]}>
                  VIDEO:
                </Text>
                {selectedVideo === "" && (
                  <TouchableOpacity
                    style={stylesLocal.imageSourceBtn}
                    onPress={seleccionarVideo}
                  >
                    <Text style={stylesLocal.imageSourceBtnText}>🎬 VIDEO</Text>
                  </TouchableOpacity>
                )}
                {selectedVideo !== "" && (
                  <View style={stylesLocal.videoContainer}>
                    <VideoView
                      style={stylesLocal.videoPreview}
                      player={player}
                      nativeControls
                      contentFit="contain"
                      allowsFullscreen
                      allowsPictureInPicture
                    />
                    <TouchableOpacity
                      style={stylesLocal.deleteCircleBtn}
                      onPress={() => {
                        setSelectedVideo("");
                        setVideoSend("");
                      }}
                    >
                      <Text style={stylesLocal.deleteCircleBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
          {error !== "" && (
            <Text
              style={[styles.error, { marginTop: 10, fontSize: scaleFont(19) }]}
            >
              {error}
            </Text>
          )}
          <View style={[styles.navigationButtons]}>
            <Boton
              uri="atras"
              onPress={handleAtrasPress}
              dissable={view === 0}
            />
            {view < 2 ? (
              <Boton
                uri="delante"
                onPress={handleSiguientePress}
                dissable={view === 2}
              />
            ) : (
              <Boton
                uri="ok"
                onPress={handleCreaPress}
                nameBottom="CREAR.MATERIAL"
              />
            )}
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
};

const stylesLocal = StyleSheet.create({
  imageSourceRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  imageSourceBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "#E8EAF6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C5CAE9",
  },
  imageSourceBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3949AB",
    letterSpacing: 0.5,
  },
  videoPreview: {
    width: "100%",
    height: 220,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  imageContainer: {
    marginTop: 16,
    width: 100,
    height: 100,
    alignSelf: "flex-start",
  },
  videoContainer: {
    marginTop: 16,
    width: "100%",
  },
  deleteCircleBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF5252",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  deleteCircleBtnText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 28,
  },
  deleteBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EF5350",
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C62828",
    letterSpacing: 0.5,
  },
});

export default CrearMaterial;
