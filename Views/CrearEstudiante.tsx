import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { styles } from "../styles/styles";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Boton from "../components/Boton";
import { Students } from "../class/Interface/Students";
import { ActivityIndicator } from "react-native-paper";
import { ImagePassword } from "../class/Interface/ImagePassword";

export default function CrearEstudiante({ navigation }: { navigation: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [text, setText] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const errores: string[] = [];
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const [passwordImages, setPasswordImages] = useState<ImagePassword[]>([]);
  const [distractorsImages, setDistractorImages] = useState<ImagePassword[]>(
    []
  );

  const [view, setView] = useState(0);

  const [openContraseña, setOpenContraseña] = useState(false);
  const [openAccesibilidad, setOpenAccesibilidad] = useState(false);
  const [openVisualizacion, setOpenVisualizacion] = useState(false);

  const [contraseñaValue, setContraseñaValue] = useState("alfanumerica");
  const [accesibilidadValue, setAccesibilidadValue] = useState<string[]>([]);
  const [visualizacionValue, setVisualizacionValue] = useState("diarias");

  const [openAsistenteVoz, setOpenAsistenteVoz] = useState(false);
  const [asistenteVozValue, setAsistenteVozValue] = useState<boolean>(true);

  const [asistenteVozItems, setAsistenteVozItems] = useState([
    { label: "Activado", value: true },
    { label: "Desactivado", value: false },
  ]);

  const [contraseñaItems, setContraseñaItems] = useState([
    { label: "Alfanumérica", value: "alfanumerica" },
    { label: "Pin", value: "pin" },
    { label: "Imágenes", value: "imagenes" },
  ]);
  const [accesibilidadItems, setAccesibilidadItems] = useState([
    { label: "Texto", value: "texto" },
    { label: "Video", value: "video" },
    { label: "Imágenes", value: "imagenes" },
    { label: "Pictogramas", value: "pictogramas" },
    { label: "Audio", value: "auido" },
  ]);
  const [visualizacionItems, setVisualizacionItems] = useState([
    { label: "Diarias", value: "diarias" },
    { label: "Semanáles", value: "semanales" },
  ]);

  const api = new ConnectApi();

  const atras = () => {
    navigation.goBack();
  };
  const seleccionaImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Se necesita permiso para acceder a la galeria");
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
    setPassword(input);
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
    const newStudent: Students = {
      username: text,
      foto: selectedImage || "porDefecto.png",
      tipoContraseña: contraseñaValue,
      accesibilidad: accesibilidadValue.join(","),
      preferenciasVisualizacion: visualizacionValue,
      asistenteVoz: asistenteVozValue,
      contraseña: password,
    };
    setIsCreate(true);

    const response = await api.createStudent(
      newStudent,
      passwordImages,
      distractorsImages
    );

    if (response.ok) {
      setTimeout(() => {
        setIsCreate(false);
        navigation.replace("GestionEstudiantes");
      }, 2000);
    } else {
      setIsCreate(false);
      setErrorMessage(["Error al crear el estudiante."]);
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

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="Atrás"
        navigation={() => atras()}
        nameHeader={api.getComponent("CrearEstudiante.png")}
        uriPictograma="estudiante"
      />

      {isCreate ? (
        <View style={[styles.content, styles.shadow]}>
          <ActivityIndicator size="large" color="#FF8C42" />
          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Creando al estudiante...
          </Text>
          <Text style={{ marginTop: 10, color: "#666" }}>
            Por favor, espera un momento.
          </Text>
        </View>
      ) : view === 0 ? (
        <View style={[styles.content, styles.shadow]}>
          <TouchableOpacity onPress={seleccionaImagen}>
            <Text>Modificar foto:</Text>
            <Image
              style={[styles.imageTarjet, styles.radius]}
              source={{ uri: selectedImage }}
            />
          </TouchableOpacity>
          <Text>Nombre de usuario:</Text>
          <TextInput
            style={[styles.buscador, styles.shadow]}
            onChangeText={handleTextChange}
            value={text}
          />
          <Text>Tipo de contraseña:</Text>
          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
              open={openContraseña}
              value={contraseñaValue}
              items={contraseñaItems}
              setOpen={setOpenContraseña}
              setValue={setContraseñaValue}
              setItems={setContraseñaItems}
              style={[styles.shadow, styles.buscador, { width: "50%" }]}
            />
          </View>
          <Text>Nueva contraseña:</Text>
          {contraseñaValue === "alfanumerica" ? (
            <TextInput
              style={[styles.buscador, styles.shadow]}
              onChangeText={handlePasswordChange}
              value={password}
              secureTextEntry={true}
            />
          ) : contraseñaValue === "pin" ? (
            <TextInput
              style={[styles.buscador, styles.shadow]}
              onChangeText={handlePasswordChange}
              value={password}
              keyboardType="number-pad"
              secureTextEntry={true}
            />
          ) : (
            <Boton
              uri="olvideContraseña"
              nameBottom="Establecer Contraseña"
              onPress={handleEstablecerContraseñaPress}
            />
          )}
          <View style={styles.navigationButtons}>
            <View></View>

            <Boton uri="delante" onPress={() => handleAccesibilidadPress()} />
          </View>
        </View>
      ) : (
        <>
          <View style={[styles.content, styles.shadow]}>
            <Text>Accesibilidad:</Text>
            <View style={{ zIndex: 1000 }}>
              <DropDownPicker
                multiple={true}
                min={1}
                max={3}
                placeholder="Seleccionar opciones"
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
              />
            </View>

            <Text>Preferencias de visualizacion de tareas:</Text>
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
                style={[styles.shadow, styles.buscador, { width: "50%" }]}
              />
            </View>
            <Text>Asistente de voz:</Text>
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
                style={[styles.shadow, styles.buscador, { width: "50%" }]}
              />
            </View>

            <View style={styles.navigationButtons}>
              <Boton uri="atras" onPress={() => handlePerfilPress()} />

              <Boton
                uri="ok"
                nameBottom="Anadir estudiante"
                onPress={() => handleAddPress()}
              />
            </View>
          </View>
          <View>
            {error && (
              <Text style={[styles.error, { margin: 10 }]}>{errorMessage}</Text>
            )}
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
}
