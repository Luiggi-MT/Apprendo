import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
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
import { ActivityIndicator } from "react-native-paper";
import { Students } from "../../../class/Interface/Students";
import { ImagePassword } from "../../../class/Interface/ImagePassword";
import { tarjetaDescipcion_styles } from "../../../styles/tarjetaDescripcion_styles";
import { Arasaac } from "../../../class/Arasaac/getPictograma";

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
  const [secureText, setSecureText] = useState(true);

  const [contraseñaValue, setContraseñaValue] = useState(
    student.tipoContraseña,
  );
  const [accesibilidadValue, setAccesibilidadValue] = useState<string[]>(
    student.accesibilidad,
  );
  const [visualizacionValue, setVisualizacionValue] = useState(
    student.preferenciasVisualizacion,
  );

  const [openAsistenteVoz, setOpenAsistenteVoz] = useState(false);

  const [asistenteVozValue, setAsistenteVozValue] = useState(
    student.asistenteVoz,
  );
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

  const [passwordImages, setPasswordImages] = useState<ImagePassword[]>([]);
  const [distractorsImages, setDistractorImages] = useState<ImagePassword[]>(
    [],
  );

  const api = new ConnectApi();
  const arasaacService = new Arasaac();

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
    setPassword(input.toUpperCase());
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
    setMessageWaiteng(`ELIMINANDO A ${student.username}...`);
    const response = await api.deleteStudent(student.username);
    if (!response.ok) {
      setWaitting(false);
      setMessageError(true);
      setMessageErrorString(response.message.Error);
    } else {
      setTimeout(() => {
        setWaitting(false);
        navigation.goBack({
          borrar: true,
        });
      }, 2000);
    }
  };

  const handleActualizarPress = async () => {
    setWaitting(true);
    setMessageWaiteng(`MODIFICANDO LOS DATOS DE ${student.username}...`);

    const updateStudent: any = {
      id: student.id,
    };

    if (text && text !== student.username) {
      updateStudent.username = text;
    }
    if (password) {
      updateStudent.contraseña = password;
    }
    if (selectedImage && selectedImage !== student.foto) {
      updateStudent.foto = selectedImage;
    }

    if (contraseñaValue !== student.tipoContraseña) {
      updateStudent.tipoContraseña = contraseñaValue;
    }
    if (accesibilidadValue.toString() !== student.accesibilidad) {
      updateStudent.accesibilidad = accesibilidadValue;
    }
    if (visualizacionValue !== student.preferenciasVisualizacion) {
      updateStudent.preferenciasVisualizacion = visualizacionValue;
    }
    if (asistenteVozValue !== student.asistenteVoz) {
      updateStudent.asistenteVoz = asistenteVozValue;
    }

    // Si no hay cambios, no hacer nada
    if (Object.keys(updateStudent).length === 1) {
      // Solo tiene 'id'
      setWaitting(false);
      setMessageError(true);
      setMessageErrorString("No hay cambios que actualizar");
      return;
    }

    const response = await api.updateStudent(
      updateStudent,
      passwordImages,
      distractorsImages,
    );
    if (!response.ok) {
      setWaitting(false);
      setMessageError(true);
      setMessageErrorString(response.message.Error);
    } else {
      setTimeout(() => {
        setWaitting(false);
        navigation.goBack({
          actualizar: true,
        });
      }, 2000);
    }
  };

  const handleAsignacionTareas = () => {
    navigation.navigate("AsignacionTareas", { student: student });
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

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="DESCRIPCIÓN.DEL.ESTUDIANTE"
        uriPictograma="estudiante"
        style={scaleFont(20)}
      />
      {waitting ? (
        <View style={[styles.content, styles.shadow]}>
          <ActivityIndicator size="large" color="#FF8C42" />
          <Text
            style={[
              styles.text,
              {
                fontFamily: "ecolar-bold",
                marginTop: 20,
                fontSize: scaleFont(18),
                fontWeight: "bold",
                color: "#333",
              },
            ]}
          >
            {messageWaiteng}
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
      ) : view === 0 ? (
        <View style={[styles.content, styles.shadow]}>
          <TouchableOpacity onPress={seleccionaImagen}>
            <Text style={styles.text_legend}>MODIFICAR FOTO:</Text>
            <Image
              style={[tarjetaDescipcion_styles.imageTarjet]}
              source={{ uri: selectedImage || api.getFoto(student.foto) }}
            />
          </TouchableOpacity>
          <Text style={styles.text_legend}>NOMBRE DE USUARIO:</Text>
          <TextInput
            style={[styles.buscador, styles.shadow]}
            onChangeText={handleTextChange}
            value={text}
            placeholder={student.username}
            autoCapitalize="characters"
          />
          <Text style={styles.text_legend}>TIPO DE CONTRASEÑA:</Text>
          <View style={{ zIndex: 1000 }}>
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
            <View>
              <TextInput
                style={[styles.buscador, styles.shadow]}
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

            <Boton uri="delante" onPress={() => handleAccesibilidadPress()} />
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
                style={[styles.shadow, styles.buscador, { width: "70%" }]}
                textStyle={styles.dropdownTextStyle}
              />
            </View>

            <View style={styles.navigationButtons}>
              <Boton uri="atras" onPress={() => handlePerfilPress()} />
              {!confirmarBorrado && (
                <Boton
                  uri="ok"
                  nameBottom="ACTUALIZAR"
                  onPress={handleActualizarPress}
                />
              )}
            </View>
          </View>
          {!confirmarBorrado ? (
            <View style={styles.buttons}>
              <Boton
                uri="grafica"
                nameBottom=" .SEGUIMIENTO. "
                onPress={() => {}}
              />
              <Boton
                uri="borrar"
                nameBottom=" .ELIMINAR ALUMNO. "
                onPress={handleBorrarPress}
              />
              <Boton
                uri="tareasPeticion"
                nameBottom="ASIGNACIÓN.DE.TAREAS"
                onPress={handleAsignacionTareas}
              />
            </View>
          ) : (
            <>
              <Text style={styles.error}>
                CONFIRMAR PARA ELIMINAR AL ESTUDIANTE.
              </Text>
              <View style={styles.navigationButtons}>
                <Boton
                  uri="x"
                  nameBottom="NO ELIMINAR"
                  onPress={handleNoEliminarPress}
                />
                <Boton
                  uri="ok"
                  nameBottom="ELIMINAR"
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
