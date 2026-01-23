import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import {
  Alert,
  FlatList,
  Image,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { scaleFont, styles } from "../../styles/styles";
import * as ImagePicker from "expo-image-picker";
import Boton from "../../components/Boton";
import { ImagePassword } from "../../class/Interface/ImagePassword";

export default function EstablecerContraseña({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { student, onPasswordSelected } = route.params;
  const api = new ConnectApi();

  const [view, setView] = useState<number>(0);

  const MAX_TOTAL_IMAGENES = 6;
  const MIN_PASSWORD = 1;
  const MIN_DISTRACTOR = 1;
  const MAX_PASSWORD = 5;
  const MAX_DISTRACTOR = 5;

  const [password, setPassword] = useState<ImagePassword[]>([]);
  const [distractors, setDistractors] = useState<ImagePassword[]>([]);
  const [disablePassword, setDisablePassword] = useState<boolean>(false);
  const [disableDistractors, setDisableDistractors] = useState<boolean>(false);

  const totalImagenes = password.length + distractors.length;
  const remainingTotal = MAX_TOTAL_IMAGENES - totalImagenes;
  const remainingPassword = Math.min(
    MAX_PASSWORD - password.length,
    remainingTotal,
  );
  const remainingDistractor = Math.min(
    MAX_DISTRACTOR - distractors.length,
    remainingTotal,
  );

  const hasMinPassword = password.length >= MIN_PASSWORD;
  const hasMinDistractor = distractors.length >= MIN_DISTRACTOR;
  const meetsMinimums = hasMinPassword && hasMinDistractor;

  const seleccionarImagen = async (isPassword: boolean) => {
    // 1. Verificar límite total
    if (totalImagenes >= MAX_TOTAL_IMAGENES) {
      Alert.alert(
        "Límite total alcanzado",
        `Máximo ${MAX_TOTAL_IMAGENES} imágenes en total. Tienes ${totalImagenes}.`,
      );
      return;
    }

    // 2. Determinar cuántas se pueden añadir
    let maxToAdd;
    if (isPassword) {
      // Para contraseñas: mínimo que falta o espacio restante
      const minRequired = MIN_PASSWORD - password.length;
      const canAddForMin = Math.max(0, minRequired);
      const canAddForMax = remainingPassword;

      maxToAdd = Math.max(canAddForMin, Math.min(canAddForMax, remainingTotal));
    } else {
      // Para distractoras: mínimo que falta o espacio restante
      const minRequired = MIN_DISTRACTOR - distractors.length;
      const canAddForMin = Math.max(0, minRequired);
      const canAddForMax = remainingDistractor;

      maxToAdd = Math.max(canAddForMin, Math.min(canAddForMax, remainingTotal));
    }

    if (maxToAdd <= 0) {
      Alert.alert(
        "No se pueden añadir más imágenes",
        isPassword
          ? `Tienes ${password.length} imágenes de contraseña (máximo: ${MAX_PASSWORD})`
          : `Tienes ${distractors.length} imágenes distractoras (máximo: ${MAX_DISTRACTOR})`,
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: maxToAdd,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset, index) => ({
          id_estudiante: student.id,
          uri: asset.uri,
          codigo: `${Date.now()}_${index}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          es_contraseña: isPassword,
        }));

        if (isPassword) {
          setPassword((prev) => [...prev, ...newImages]);
        } else {
          setDistractors((prev) => [...prev, ...newImages]);
        }
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error);
      Alert.alert("Error", "No se pudieron cargar las imágenes");
    }
  };

  const atras = () => {
    navigation.goBack();
  };
  const handleSiguientePress = () => {
    setView(1);
  };
  const handleAtrasPress = () => {
    setView(0);
  };

  const handleGuardarContraseñaPress = async () => {
    if (password.length < MIN_PASSWORD || distractors.length < MIN_DISTRACTOR) {
      Alert.alert("Es necesario añadir una imagen de cada tipo");
      return;
    }
    if (onPasswordSelected) onPasswordSelected(password, distractors);
    navigation.goBack();
  };
  const getImagenPassword = async () => {
    if (student.id) {
      const responsePassword = await api.getImagePassword(true, student.id);
      const responseDistractor = await api.getImagePassword(false, student.id);
      if (responsePassword && responseDistractor) {
        setPassword(responsePassword.message);
        setDistractors(responseDistractor.message);
      }
    }
  };
  const eliminarImagenPassword = (index: number) => {
    setPassword((prev) => prev.filter((_, i) => i !== index));
  };

  const eliminarImagenDistractor = (index: number) => {
    setDistractors((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="ESTABLECER.CONTRASEÑA"
        uriPictograma="olvideContraseña"
        style={scaleFont(20)}
      />
      {view === 0 ? (
        <>
          <View style={[styles.content, styles.shadow]}>
            <Text style={styles.text_legend}>
              SELECCIONAR LAS IMÁGENES DE LA CONTRASEÑA:
            </Text>
            <View>
              <FlatList
                data={password}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <View style={{ marginTop: 10 }}>
                    <Image
                      key={index}
                      source={{ uri: item.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        margin: 5,
                        borderWidth: 1,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => eliminarImagenPassword(index)}
                      style={{
                        position: "absolute",
                        top: -5,
                        right: 0,
                        backgroundColor: "red",
                        borderRadius: 15,
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 5, // Sombra en Android
                        shadowColor: "#000", // Sombra en iOS
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <Text style={styles.error}>
                    NO SE HAN SELECCIONADO IMÁGENES
                  </Text>
                }
                scrollEnabled={false}
              />
            </View>
            {!disablePassword && (
              <View style={[styles.buttons, { width: "40%" }]}>
                <Boton
                  uri="mas"
                  nameBottom="AÑADIR.IMÁGENES"
                  onPress={() => seleccionarImagen(true)}
                />
              </View>
            )}
          </View>
          <View style={styles.navigationButtons}>
            <View></View>
            <Boton uri="delante" onPress={handleSiguientePress} />
          </View>
        </>
      ) : (
        <>
          <View
            style={[
              styles.content,
              styles.shadow,
              { justifyContent: "center" },
            ]}
          >
            <Text style={styles.text_legend}>
              SELECCIONA LAS IMÁGENES DISTRACTORIAS:
            </Text>
            <View>
              <FlatList
                data={distractors}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <View style={{ marginTop: 10 }}>
                    <Image
                      key={index}
                      source={{ uri: item.uri }}
                      style={{ width: 100, height: 100, margin: 5 }}
                    />
                    <TouchableOpacity
                      onPress={() => eliminarImagenDistractor(index)}
                      style={{
                        position: "absolute",
                        top: -5,
                        right: 0,
                        backgroundColor: "red",
                        borderRadius: 15,
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 5, // Sombra en Android
                        shadowColor: "#000", // Sombra en iOS
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <Text style={styles.error}>
                    NO SE HAN SELECCIONADOO IMÁGENES
                  </Text>
                }
                scrollEnabled={false}
              />
            </View>
            {!disableDistractors && (
              <View style={[styles.buttons]}>
                <Boton
                  uri="mas"
                  nameBottom="AÑADIR.IMÁGENES"
                  onPress={() => seleccionarImagen(false)}
                />
              </View>
            )}
          </View>
          <View style={styles.navigationButtons}>
            <Boton uri="atras" onPress={handleAtrasPress} />
            <View>
              <Boton
                uri="ok"
                nameBottom="GUARDAR.CONTRASEÑA"
                onPress={handleGuardarContraseñaPress}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
}
