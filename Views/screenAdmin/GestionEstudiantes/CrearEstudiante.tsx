import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { scaleFont, styles } from "../../../styles/styles";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Boton from "../../../components/Boton";
import { Students } from "../../../class/Interface/Students";
import { ActivityIndicator } from "react-native-paper";
import { ImagePassword } from "../../../class/Interface/ImagePassword";
import { tarjetaDescipcion_styles } from "../../../styles/tarjetaDescripcion_styles";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
import LottieView from "lottie-react-native";

const ERROR_TIME_MS = 2500;
const OK_TIME_MS = 2000;

export default function CrearEstudiante({ navigation }: { navigation: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [text, setText] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const errores: string[] = [];
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [secureText, setSecureText] = useState(true);

  const [passwordImages, setPasswordImages] = useState<ImagePassword[]>([]);
  const [distractorsImages, setDistractorImages] = useState<ImagePassword[]>(
    [],
  );

  const [view, setView] = useState(0);

  const [openContraseña, setOpenContraseña] = useState(false);
  const [openAccesibilidad, setOpenAccesibilidad] = useState(false);
  const [openVisualizacion, setOpenVisualizacion] = useState(false);
  const [openAsistenteVoz, setOpenAsistenteVoz] = useState(false);

  const [contraseñaValue, setContraseñaValue] =
    useState<string>("alfanumerica");
  const [accesibilidadValue, setAccesibilidadValue] = useState<string[]>([]);
  const [visualizacionValue, setVisualizacionValue] = useState("diarias");

  const [asistenteVozValue, setAsistenteVozValue] = useState<string>("none");
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [okAnimation, setOkAnimation] = useState(false);

  const [asistenteVozItems, setAsistenteVozItems] = useState([
    { label: "NINGUNO", value: "none" },
    { label: "UNIDIRECCIONAL", value: "unidireccional" },
    { label: "BIDIRECCIONAL", value: "bidireccional" },
  ]);

  const [contraseñaItems, setContraseñaItems] = useState([
    { label: "ALFANUMÉRICA", value: "alfanumerica" },
    { label: "PIN", value: "pin" },
    { label: "IMÁGENES", value: "imagenes" },
  ]);
  const [accesibilidadItems, setAccesibilidadItems] = useState([
    { label: "TEXTO", value: "texto" },
    { label: "VIDEO", value: "video" },
    { label: "IMÁGENES", value: "imagenes" },
    { label: "PICTOGRAMAS", value: "pictogramas" },
    { label: "AUDIO", value: "audio" },
  ]);
  const [visualizacionItems, setVisualizacionItems] = useState([
    { label: "DIARIAS", value: "diarias" },
    { label: "SEMANÁLES", value: "semanales" },
  ]);

  const api = new ConnectApi();
  const arasaacService = new Arasaac();

  const atras = () => {
    navigation.goBack();
  };
  const seleccionaImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError(true);
      setErrorMessage(["Se necesita permiso para acceder a la galeria"]);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setSelectedImage(base64Image);
    }
  };
  const handleTextChange = (input: string) => {
    setText(input);
  };
  const handlePasswordChange = (input: string) => {
    setPassword(input.toUpperCase());
  };

  const handleAccesibilidadPress = () => {
    setView(1);
  };

  const handlePerfilPress = () => {
    setView(0);
  };

  const handleAddPress = async () => {
    if (!text) errores.push("El nombre de usuario es obligatorio. ");

    if (contraseñaValue === "alfanumerica" || contraseñaValue === "pin") {
      if (!password || password.length < 4)
        errores.push("La contraseña debe tener al menos 4 caracteres. ");
    }

    if (accesibilidadValue.length === 0)
      errores.push("Debe seleccionar al menos una opción de accesibilidad. ");

    const tieneLetras = /[a-zA-Z]/.test(password);
    if (contraseñaValue === "pin" && tieneLetras) {
      errores.push("El PIN no puede contener letras.");
    }

    if (
      contraseñaValue === "imagenes" &&
      passwordImages.length === 0 &&
      distractorsImages.length === 0
    ) {
      errores.push("La contraseña de imagenes no puede estar vacio. ");
    }

    if (errores.length > 0) {
      setError(true);
      setErrorMessage(errores);
      return;
    }
    setError(false);
    setErrorMessage([]);
    setIsCreate(true);
    const newStudent: Students = {
      username: text.toUpperCase(),
      foto: selectedImage || "porDefecto.png",
      tipoContraseña: contraseñaValue,
      accesibilidad: accesibilidadValue.join(","),
      preferenciasVisualizacion: visualizacionValue,
      asistenteVoz: asistenteVozValue,
      contraseña: password.toUpperCase(),
    };

    const response = await api.createStudent(
      newStudent,
      passwordImages,
      distractorsImages,
    );

    console.log("Respuesta de createStudent:", response);
    if (response.ok) {
      setIsCreate(false);
      setOkAnimation(true);
      setErrorMessage([]);
      setError(false);
      setTimeout(async () => {
        setOkAnimation(false);
        navigation.goBack({
          actualizar: true,
        });
      }, OK_TIME_MS);
    } else {
      setIsCreate(false);
      setErrorAnimation(true);
      setError(true);
      setErrorMessage([response.message.toUpperCase()]);
      setTimeout(async () => {
        setErrorAnimation(false);
      }, ERROR_TIME_MS);
      return;
    }
  };
  const handleEstablecerContraseñaPress = () => {
    navigation.navigate("EstablecerContraseña", {
      student: {},
      onPasswordSelected: (pass: ImagePassword[], dist: ImagePassword[]) => {
        setPasswordImages(pass);
        setDistractorImages(dist);
      },
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
        nameHeader="CREAR.ESTUDIANTE"
        uriPictograma="estudiante"
        style={scaleFont(20)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {isCreate ? (
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
                CREANDO AL ESTUDIANTE...
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
          ) : isCreate === false && errorAnimation === true ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                source={require("../../../assets/animations/error.json")}
                autoPlay
                loop={false}
                style={{ width: 700, height: 700, alignSelf: "center" }}
              />
            </View>
          ) : okAnimation === true ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                source={require("../../../assets/animations/success.json")}
                autoPlay
                loop={false}
                style={{ width: 700, height: 700, alignSelf: "center" }}
              />
            </View>
          ) : view === 0 ? (
            <View style={[styles.content, styles.shadow]}>
              <TouchableOpacity onPress={seleccionaImagen}>
                <Text style={styles.text_legend}>SELECCIONAR FOTO:</Text>
                <Image
                  style={[tarjetaDescipcion_styles.imageTarjet]}
                  source={{ uri: selectedImage }}
                />
              </TouchableOpacity>
              <Text style={styles.text_legend}>NOMBRE DE USUARIO:</Text>
              <TextInput
                style={[styles.buscador, styles.shadow]}
                onChangeText={handleTextChange}
                value={text}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
              />

              <Text style={styles.text_legend}>TIPO DE CONTRASEÑA:</Text>
              <View style={{ zIndex: 900 }}>
                <DropDownPicker
                  open={openContraseña}
                  value={contraseñaValue}
                  items={contraseñaItems}
                  setOpen={setOpenContraseña}
                  setValue={setContraseñaValue}
                  setItems={setContraseñaItems}
                  style={[styles.shadow, styles.buscador, { width: "50%" }]}
                  textStyle={styles.dropdownTextStyle}
                />
              </View>

              <Text style={styles.text_legend}>NUEVA CONTRASEÑA:</Text>
              {contraseñaValue === "alfanumerica" ? (
                <View
                  style={[
                    styles.buscador,
                    styles.shadow,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingRight: 15,
                    },
                  ]}
                >
                  <TextInput
                    style={{ flex: 1, height: "100%" }}
                    onChangeText={handlePasswordChange}
                    value={password}
                    secureTextEntry={secureText}
                    autoCorrect={false}
                    autoComplete="off"
                  />
                  <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    {secureText && (
                      <Image
                        source={{ uri: api.getComponent("ojo.png") }}
                        style={styles.image}
                      />
                    )}
                    {!secureText && (
                      <Image
                        source={{ uri: arasaacService.getPictograma("ojo") }}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : contraseñaValue === "pin" ? (
                <View
                  style={[
                    styles.buscador,
                    styles.shadow,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingRight: 15,
                    },
                  ]}
                >
                  <TextInput
                    style={{ flex: 1, height: "100%" }}
                    onChangeText={handlePasswordChange}
                    value={password}
                    keyboardType="number-pad"
                    secureTextEntry={secureText}
                  />
                  <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    {secureText && (
                      <Image
                        source={{ uri: api.getComponent("ojo.png") }}
                        style={styles.image}
                      />
                    )}
                    {!secureText && (
                      <Image
                        source={{ uri: arasaacService.getPictograma("ojo") }}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <Boton
                  uri="olvideContraseña"
                  nameBottom="ESTABLECER.CONTRASEÑA"
                  onPress={handleEstablecerContraseñaPress}
                />
              )}
              <View style={styles.navigationButtons}>
                <View></View>

                <Boton uri="delante" onPress={handleAccesibilidadPress} />
              </View>
            </View>
          ) : (
            <>
              <View style={[styles.content, styles.shadow]}>
                <Text style={styles.text_legend}>ACCESIBILIDAD:</Text>
                <View style={{ zIndex: 1000 }}>
                  <DropDownPicker
                    multiple={true}
                    min={1}
                    max={3}
                    placeholder="SELECCIONAR OPCIONES"
                    mode="BADGE"
                    listMode="SCROLLVIEW"
                    dropDownContainerStyle={{
                      maxHeight: 200,
                    }}
                    open={openAccesibilidad}
                    value={accesibilidadValue}
                    items={accesibilidadItems}
                    setOpen={setOpenAccesibilidad}
                    setValue={setAccesibilidadValue}
                    setItems={setAccesibilidadItems}
                    style={[styles.shadow, styles.buscador, { width: "95%" }]}
                    textStyle={styles.dropdownTextStyle}
                  />
                </View>

                <Text style={styles.text_legend}>
                  PREFERENCIAS DE VISUALIZACIÓN DE TAREAS:
                </Text>
                <View style={{ zIndex: 900 }}>
                  <DropDownPicker
                    open={openVisualizacion}
                    value={visualizacionValue}
                    items={visualizacionItems}
                    setOpen={setOpenVisualizacion}
                    setValue={setVisualizacionValue}
                    setItems={setVisualizacionItems}
                    listMode="SCROLLVIEW"
                    dropDownContainerStyle={{
                      maxHeight: 200,
                    }}
                    style={[styles.shadow, styles.buscador, { width: "70%" }]}
                    textStyle={styles.dropdownTextStyle}
                  />
                </View>
                <Text style={styles.text_legend}>ASISTENTE DE VOZ:</Text>
                <View style={{ zIndex: 800 }}>
                  <DropDownPicker
                    open={openAsistenteVoz}
                    value={asistenteVozValue}
                    items={asistenteVozItems}
                    setOpen={setOpenAsistenteVoz}
                    setValue={setAsistenteVozValue}
                    setItems={setAsistenteVozItems}
                    listMode="SCROLLVIEW"
                    dropDownContainerStyle={{
                      maxHeight: 200,
                    }}
                    style={[styles.shadow, styles.buscador, { width: "70%" }]}
                    textStyle={styles.dropdownTextStyle}
                  />
                </View>

                <View style={styles.navigationButtons}>
                  <Boton uri="atras" onPress={handlePerfilPress} />

                  <Boton
                    uri="ok"
                    nameBottom="AÑADIR.ESTUDIANTE"
                    onPress={handleAddPress}
                  />
                </View>
                {error &&
                  errorMessage.map((msg, i) => (
                    <Text key={i} style={[styles.error, { margin: 10 }]}>
                      {msg}
                    </Text>
                  ))}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
