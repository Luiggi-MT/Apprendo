import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { MaterialEscolar } from "../../../../class/Interface/MaterialEscolar";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import Splash from "../../../../components/Splash";
import { TextInput } from "react-native-paper";
import ColorPicker from "../../../../components/ColorPicker";
import Boton from "../../../../components/Boton";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { VideoView, useVideoPlayer } from "expo-video";

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
const DetallesMaterial = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const materialFromRoute: MaterialEscolar | undefined =
    route?.params?.material;
  const id = route?.params?.materialId;
  const [isModificate, setIsModificate] = useState(false);
  const [view, setView] = useState(0);
  const [material, setMaterial] = useState<MaterialEscolar | null>(
    materialFromRoute ?? null,
  );
  const [nombre, setNombre] = useState(material?.nombre ?? "");
  const [selectedColor, setSelectedColor] = useState(
    material?.color ?? COLORS[0],
  );
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [forma, setForma] = useState<string>("");
  const [tamaño, setTamaño] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [videoSend, setVideoSend] = useState<string>("");
  const [splashName, setSplashName] = useState<string>("");
  const [videoServer, setVideoServer] = useState<boolean>(true);
  const [imagenServer, setImagenServer] = useState<boolean>(true);

  const imageMediaType =
    (ImagePicker as any)["MediaType"]?.Images ??
    ImagePicker.MediaTypeOptions.Images;
  const videoMediaType =
    (ImagePicker as any)["MediaType"]?.Videos ??
    ImagePicker.MediaTypeOptions.Videos;
  const api = new ConnectApi();
  const player = useVideoPlayer(
    selectedVideo
      ? { uri: videoServer ? api.getMedia(selectedVideo) : selectedVideo }
      : null,
    (player) => {
      player.loop = false;
    },
  );

  const arasaacService = new Arasaac();

  const atras = () => navigation.goBack();

  const handleAtrasPress = () => {
    setView(view - 1);
  };

  const handleSiguientePress = () => {
    setView(view + 1);
  };
  const handleAñadirPress = (tipo: string) => {
    navigation.navigate("AñadirPictograma", {
      tipoParam: tipo,
      onselect: (id: number, tipoAsignado: string) => {
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
      aspect: [4, 3],
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
  const handleBorrarPress = async () => {
    setError("");
    setIsModificate(true);
    setSplashName("BORRANDO");

    const response = await api.deleteMaterialEscolar(id);
    if (response !== null) {
      setError(response.toUpperCase());
      setIsModificate(false);
      return;
    }

    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };
  const handleActualizarPress = async () => {
    if (
      !nombre.trim() ||
      !materialId ||
      cantidad <= 0 ||
      !forma.trim() ||
      !tamaño.trim() ||
      !selectedImage.trim() ||
      !videoSend.trim()
    ) {
      setError("TODOS LOS CAMPOS SON OBLIGATORIOS.");
    }
    setError("");
    setIsModificate(true);
    setSplashName("ACTUALIZANDO");
    const materialUpdate = {
      id: id,
      nombre: nombre,
      color: selectedColor,
      pictogramaId: materialId,
      cantidad: cantidad,
      forma: forma,
      tamaño: tamaño,
      imagen: selectedImage,
      video: videoSend,
      imagenModificada: !imagenServer,
      videoModificado: !videoServer,
    };
    api.updateMaterialEscolar(materialUpdate).then((response) => {
      if (response !== null) {
        setError(response.toUpperCase());
        setIsModificate(false);
        return;
      }
      setTimeout(() => {
        setIsModificate(false);
        navigation.goBack();
      }, 2000);
    });
  };
  useEffect(() => {
    setIsModificate(true);
    setSplashName("CARGANDO");
    api.getMaterialEscolarById(id).then((data) => {
      if (data) {
        setMaterial(data);
        setNombre(data.nombre);
        setSelectedColor(data.color ?? COLORS[0]);
        setMaterialId(data.pictogramaId);
        setCantidad(data.cantidad);
        setForma(data.forma);
        setTamaño(data.tamaño);
        setSelectedImage(data.imagen);
        setSelectedVideo(data.video);
      }
      setIsModificate(false);
    });
  }, [materialFromRoute]);

  const insets = useSafeAreaInsets();
  const handleNombreChange = (text: string) => {
    setNombre(text);
  };

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="DETALLES.DEL.MATERIAL"
        uriPictograma="materialEscolar"
        style={scaleFont(26)}
      />
      {isModificate ? (
        <Splash name={splashName} />
      ) : (
        <>
          <View style={[styles.content, styles.shadow]}>
            {view === 0 && (
              <View>
                <Text style={styles.text_legend}>NOMBRE:</Text>
                <TextInput
                  style={[
                    styles.buscador,
                    styles.shadow,
                    { textAlign: "left", paddingHorizontal: 15, height: 50 },
                  ]}
                  placeholder={material?.nombre}
                  onChangeText={handleNombreChange}
                  value={nombre}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  textColor="#000"
                  placeholderTextColor="#666"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  theme={{
                    colors: { onSurface: "#000", onSurfaceVariant: "#666" },
                  }}
                />
                <Text style={[styles.text_legend, { marginTop: 20 }]}>
                  COLOR:
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
                <Text style={styles.text_legend}>PICTOGRAMA:</Text>
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
                  theme={{
                    colors: { onSurface: "#000", onSurfaceVariant: "#666" },
                  }}
                  placeholder={material?.cantidad?.toString() ?? "0"}
                  onChangeText={(text) => setCantidad(Number(text))}
                  value={cantidad.toString()}
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
                  theme={{
                    colors: { onSurface: "#000", onSurfaceVariant: "#666" },
                  }}
                  value={forma}
                  onChangeText={setForma}
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
                  theme={{
                    colors: { onSurface: "#000", onSurfaceVariant: "#666" },
                  }}
                  value={tamaño}
                  onChangeText={setTamaño}
                  autoCapitalize="characters"
                />
              </View>
            )}
            {view === 2 && (
              <View>
                <Text style={[styles.text_legend]}>FOTO:</Text>
                {selectedImage === "" && (
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
                )}
                {selectedImage !== "" && (
                  <View style={stylesLocal.imageContainer}>
                    <Image
                      source={{
                        uri: imagenServer
                          ? api.getMedia(selectedImage)
                          : selectedImage,
                      }}
                      style={styles.imageBase}
                    />
                    <TouchableOpacity
                      style={[
                        stylesLocal.deleteCircleBtn,
                        { top: -10, right: -10 },
                      ]}
                      onPress={() => {
                        setSelectedImage("");
                        setImagenServer(false);
                      }}
                    >
                      <Text style={stylesLocal.deleteCircleBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={[styles.text_legend, { marginTop: 10 }]}>
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
                        setVideoServer(false);
                      }}
                    >
                      <Text style={stylesLocal.deleteCircleBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            <View style={[styles.navigationButtons]}>
              <Boton
                uri="atras"
                onPress={handleAtrasPress}
                dissable={view === 0}
              />
              <Boton
                uri="delante"
                onPress={handleSiguientePress}
                dissable={view === 2}
              />
            </View>
          </View>
          {error !== "" && (
            <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
              {error}
            </Text>
          )}
          {view === 2 && (
            <View style={[styles.navigationButtons]}>
              <Boton
                uri="borrar"
                onPress={handleBorrarPress}
                nameBottom="BORRAR"
              />
              <Boton
                uri="ok"
                onPress={handleActualizarPress}
                nameBottom="ACTUALIZAR"
              />
            </View>
          )}
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
    width: 100,
    height: 100,
    alignSelf: "flex-start",
  },
  videoContainer: {
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

export default DetallesMaterial;
