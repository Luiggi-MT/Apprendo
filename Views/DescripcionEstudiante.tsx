import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { styles } from "../styles/styles";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Boton from "../components/Boton";
import { ActivityIndicator } from "react-native-paper";
import { Students } from "../class/Interface/Students";
import { ImagePassword } from "../class/Interface/ImagePassword";

export default function DescripcionEstudiante({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student } = route.params;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [text, setText] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [messageError, setMessageError] = useState<boolean>(false);
  const [messageErrorString, setMessageErrorString] = useState<string>("");

  const [view, setView] = useState(0);
  const [confirmarBorrado, setConfirmarBorrado] = useState<boolean>(false);
  const [waitting, setWaitting] = useState<boolean>(false);
  const [messageWaiteng, setMessageWaiteng] = useState<string>("");

  const [openContraseña, setOpenContraseña] = useState(false);
  const [openAccesibilidad, setOpenAccesibilidad] = useState(false);
  const [openVisualizacion, setOpenVisualizacion] = useState(false);

  const [contraseñaValue, setContraseñaValue] = useState(
    student.tipoContraseña
  );
  const [accesibilidadValue, setAccesibilidadValue] = useState<string[]>(
    student.accesibilidad
  );
  const [visualizacionValue, setVisualizacionValue] = useState(
    student.preferenciasVisualizacion
  );

  const [openAsistenteVoz, setOpenAsistenteVoz] = useState(false);
  const [asistenteVozValue, setAsistenteVozValue] = useState(
    student.asistenteVoz
  );
  const [asistenteVozItems, setAsistenteVozItems] = useState([
    { label: "Activado", value: 1 },
    { label: "Desactivado", value: 0 },
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

  const [passwordImages, setPasswordImages] = useState<ImagePassword[]>([]);
  const [distractorsImages, setDistractorImages] = useState<ImagePassword[]>(
    []
  );

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
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
      selectionLimit: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
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

  const handleBorrarPress = async () => {
    setConfirmarBorrado(true);
  };

  const handleNoEliminarPress = () => {
    setConfirmarBorrado(false);
  };

  const handleConfirmarBorradoPress = async () => {
    setWaitting(true);
    setMessageWaiteng(`Eliminando a ${student.username}...`);
    const response = await api.deleteStudent(student.username);
    if (!response.ok) {
      setWaitting(false);
      setMessageError(true);
      setMessageErrorString(response.message.Error);
    } else {
      setTimeout(() => {
        setWaitting(false);
        navigation.replace("GestionEstudiantes");
      }, 2000);
    }
  };

  const handleActualizarPress = async () => {
    setWaitting(true);
    setMessageWaiteng(`Modificando los datos de ${student.username}...`);
    const updateStudent: Students = {
      id: student.id,
      username: text,
      contraseña: password,
      foto: selectedImage,
      tipoContraseña: contraseñaValue,
      accesibilidad: accesibilidadValue.toString(),
      preferenciasVisualizacion: visualizacionValue,
      asistenteVoz: asistenteVozValue,
    };
    const response = await api.updateStudent(
      updateStudent,
      passwordImages,
      distractorsImages
    );

    if (!response.ok) {
      setWaitting(false);
      setMessageError(true);
      setMessageErrorString(response.message.Error);
    } else {
      setTimeout(() => {
        setWaitting(false);
        navigation.replace("GestionEstudiantes");
      }, 2000);
    }
  };

  const handleEstablecerContraseñaPress = () => {
    navigation.navigate("EstablecerContraseña", {
      student: student,
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
        nameHeader={api.getComponent("DescripcionDelEstudiante.png")}
        uriPictograma="estudiante"
      />
      {waitting ? (
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
            {messageWaiteng}
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
              source={{ uri: selectedImage || api.getFoto(student.foto) }}
            />
          </TouchableOpacity>
          <Text>Nombre de usuario:</Text>
          <TextInput
            style={[styles.buscador, styles.shadow]}
            onChangeText={handleTextChange}
            value={text}
            placeholder={student.username}
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
            />
          ) : contraseñaValue === "pin" ? (
            <TextInput
              style={[styles.buscador, styles.shadow]}
              onChangeText={handlePasswordChange}
              value={password}
              keyboardType="number-pad"
            />
          ) : (
            <Boton
              uri="olvideContraseña"
              nameBottom="Establecer contraseña"
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
                style={[styles.shadow, styles.buscador, { width: "50%" }]}
              />
            </View>

            <View style={styles.navigationButtons}>
              <Boton uri="atras" onPress={() => handlePerfilPress()} />
              {!confirmarBorrado && (
                <Boton
                  uri="ok"
                  nameBottom="Actualizar"
                  onPress={() => handleActualizarPress()}
                />
              )}
            </View>
          </View>
          {!confirmarBorrado ? (
            <View style={styles.buttons}>
              <Boton
                uri="grafica"
                nameBottom="Seguimiento"
                onPress={() => {}}
              />
              <Boton
                uri="borrar"
                nameBottom="Eliminar alumno"
                onPress={handleBorrarPress}
              />
              <Boton
                uri="tareasPeticion"
                nameBottom="Asignación de tareas"
                onPress={() => {}}
              />
            </View>
          ) : (
            <>
              <Text style={styles.error}>
                Confirma para eliminar al estudiante
              </Text>
              <View style={styles.navigationButtons}>
                <Boton
                  uri="x"
                  nameBottom="No eliminar"
                  onPress={handleNoEliminarPress}
                />
                <Boton
                  uri="ok"
                  nameBottom="Eliminar"
                  onPress={handleConfirmarBorradoPress}
                />
              </View>
            </>
          )}
          {messageError && (
            <Text style={styles.error}>{messageErrorString}</Text>
          )}
        </>
      )}
    </SafeAreaProvider>
  );
}
