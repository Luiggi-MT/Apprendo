import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import Boton from "../../../../components/Boton";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import Splash from "../../../../components/Splash";
import { Menu } from "../../../../class/Interface/Menu";
import { fontConfig } from "react-native-paper/lib/typescript/styles/fonts";

export default function CrearMenu({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const [pictogramaId, setPictogramaId] = useState<number>(0);
  const [primerPlatoId, setPrimerPlatoId] = useState<number>(0);
  const [segundoPlatoId, setSegundoPlatoId] = useState<number>(0);
  const [postreId, setPostreId] = useState<number>(0);

  const [isTachado, setIsTachado] = useState<boolean>(false);

  const [descripcion, setDescripcion] = useState<string>("");

  const [primerPlato, setPrimerPlato] = useState<string>("");
  const [segundoPlato, setSegundoPlato] = useState<string>("");
  const [postre, setPostre] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mensajeValue, setMensajeValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const [view, setView] = useState<number>(0);

  const insets = useSafeAreaInsets();
  const api = new ConnectApi();
  const arasaacService = new Arasaac();

  const handleAñadirPress = (tipo: string) => {
    navigation.navigate("AñadirPictograma", {
      tipoParam: tipo,
      onSelect: (id: number, tipoAsignado: string) => {
        if (tipoAsignado === "menu") setPictogramaId(id);
        if (tipoAsignado === "primerPlato") setPrimerPlatoId(id);
        if (tipoAsignado === "segundoPlato") setSegundoPlatoId(id);
        if (tipoAsignado === "postre") setPostreId(id);
      },
    });
  };

  const handleDescripcionChange = (word: string) => {
    setDescripcion(word.toUpperCase());
  };

  const handlePrimeroPlatoChange = (word: string) => {
    setPrimerPlato(word.toUpperCase());
  };

  const handleSegundoPlatoChange = (word: string) => {
    setSegundoPlato(word.toUpperCase());
  };

  const handlePostreChange = (word: string) => {
    setPostre(word.toUpperCase());
  };

  const handleSiguentePress = () => {
    if (view < 3) {
      setView(view + 1);
    }
  };

  const handleAtrasPress = () => {
    if (view > 0) {
      setView(view - 1);
    } else {
      navigation.goBack();
    }
  };
  const handleGuardarMenu = async () => {
    if (
      pictogramaId === 0 &&
      descripcion.trim() === "" &&
      primerPlato.trim() === "" &&
      segundoPlato.trim() === "" &&
      postre.trim() === "" &&
      primerPlatoId === 0 &&
      segundoPlatoId === 0 &&
      postreId === 0
    ) {
      setError(true);
      setMensajeValue("POR FAVOR, COMPLETA TODOS LOS CAMPOS");
      return;
    }
    const menu: Menu = {
      id_pictograma: pictogramaId,
      tachado: isTachado,
      descripcion: descripcion,
      categoria: "menu",
      platos: [
        {
          id_pictograma: primerPlatoId,
          nombre: primerPlato,
          categoria: "primero",
        },
        {
          id_pictograma: segundoPlatoId,
          nombre: segundoPlato,
          categoria: "segundo",
        },
      ],
    };
    const response = await api.createMenu(menu);
    if (response.ok) {
      const menu: Menu = {
        id_pictograma: postreId,
        tachado: false,
        descripcion: postre,
        categoria: "postre",
        platos: [
          {
            id_pictograma: postreId,
            nombre: postre,
            categoria: "postre",
          },
        ],
      };
      const response = await api.createMenu(menu);
      if (response.ok) {
        setIsLoading(true);
        setMensajeValue("CREANDO LOS DATOS DEL MENÚ");
        if (response.ok) {
          setTimeout(() => {
            setIsLoading(false);
            navigation.goBack({
              createMenu: "ok",
            });
          }, 2000);
        } else {
          setIsLoading(false);
          setError(true);
          setMensajeValue("ERROR AL CREAR EL MENÚ");
          setTimeout(() => {
            setError(false);
            setMensajeValue("");
          }, 2000);
        }
      } else {
        setIsLoading(false);
        setError(true);
        setMensajeValue("ERROR AL CREAR EL MENÚ");
        setTimeout(() => {
          setError(false);
          setMensajeValue("");
        }, 2000);
      }
    }
  };
  const atras = () => navigation.goBack();

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="CREAR.MENÚ"
        uriPictograma="pollo"
        style={scaleFont(36)}
      />
      {isLoading ? (
        <Splash name={mensajeValue} />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <>
              <View style={[styles.content, styles.shadow]}>
                {view === 0 && (
                  <View>
                    <TouchableOpacity onPress={() => handleAñadirPress("menu")}>
                      <Text style={styles.text_legend}>SELECCIONAR FOTO:</Text>
                      <View style={{ alignItems: "center" }}>
                        {!isTachado ? (
                          <Image
                            style={[
                              styles.imageBase,
                              { borderWidth: 1, borderRadius: 5 },
                            ]}
                            source={{
                              uri: arasaacService.getPictogramaId(pictogramaId),
                            }}
                          />
                        ) : (
                          <View style={styles.superPuesto}>
                            <Image
                              source={{
                                uri: arasaacService.getPictogramaId(
                                  pictogramaId,
                                ),
                              }}
                              style={[
                                styles.imageBase,
                                { borderWidth: 1, borderRadius: 5 },
                              ]}
                            />
                            <Image
                              source={{
                                uri: arasaacService.getPictograma("fallo"),
                              }}
                              style={styles.imageOverlay}
                            />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 15 }}>
                      <Text style={styles.text_legend}>TACHAR:</Text>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                        onPress={() => setIsTachado(!isTachado)}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            {
                              borderColor: isTachado ? "#FF0000" : "#555",
                              marginBottom: 0,
                            },
                          ]}
                        >
                          {isTachado && <View style={styles.radioInner} />}
                        </View>
                        <Text
                          style={[
                            styles.text,
                            { marginLeft: 10, textAlignVertical: "center" },
                          ]}
                        >
                          {isTachado ? "SÍ, TACHADO" : "NO, NORMAL"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 15 }}>
                      <Text style={styles.text_legend}>DESCRIPCION:</Text>
                      <TextInput
                        style={[
                          styles.buscador,
                          styles.shadow,
                          {
                            textAlign: "left",
                            paddingHorizontal: 15,
                            height: 50,
                          },
                        ]}
                        placeholder="EJEMPLO CON CARNE..."
                        onChangeText={handleDescripcionChange}
                        value={descripcion}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        autoComplete="off"
                      />
                    </View>
                  </View>
                )}

                {view === 1 && (
                  <View>
                    <Text style={styles.text_legend}>PRIMER PLATO:</Text>
                    <TextInput
                      style={[
                        styles.buscador,
                        styles.shadow,
                        {
                          textAlign: "left",
                          paddingHorizontal: 15,
                          height: 50,
                        },
                      ]}
                      placeholder="EJEMPLO: POLLO CON ARROZ..."
                      onChangeText={handlePrimeroPlatoChange}
                      value={primerPlato}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      autoComplete="off"
                    />
                    <TouchableOpacity
                      style={{ marginTop: 15 }}
                      onPress={() => handleAñadirPress("primerPlato")}
                    >
                      <Text style={styles.text_legend}>
                        SELECCIONAR PICTOGRÁMA:
                      </Text>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={{
                            uri: arasaacService.getPictogramaId(primerPlatoId),
                          }}
                          style={[
                            styles.imageBase,
                            { borderWidth: 1, borderRadius: 5 },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {view === 2 && (
                  <View>
                    <Text style={styles.text_legend}>SEGUNDO PLATO:</Text>
                    <TextInput
                      style={[
                        styles.buscador,
                        styles.shadow,
                        {
                          textAlign: "left",
                          paddingHorizontal: 15,
                          height: 50,
                        },
                      ]}
                      placeholder="EJEMPLO: PESCADO CON PATATAS..."
                      onChangeText={handleSegundoPlatoChange}
                      value={segundoPlato}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      autoComplete="off"
                    />
                    <TouchableOpacity
                      style={{ marginTop: 15 }}
                      onPress={() => handleAñadirPress("segundoPlato")}
                    >
                      <Text style={styles.text_legend}>
                        SELECCIONAR PICTOGRÁMA:
                      </Text>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={{
                            uri: arasaacService.getPictogramaId(segundoPlatoId),
                          }}
                          style={[
                            styles.imageBase,
                            { borderWidth: 1, borderRadius: 5 },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {view === 3 && (
                  <View>
                    <Text style={styles.text_legend}>POSTRE:</Text>
                    <TextInput
                      style={[
                        styles.buscador,
                        styles.shadow,
                        {
                          textAlign: "left",
                          paddingHorizontal: 15,
                          height: 50,
                        },
                      ]}
                      placeholder="EJEMPLO: FLAN CON CHOCOLATE..."
                      onChangeText={handlePostreChange}
                      value={postre}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      autoComplete="off"
                    />
                    <TouchableOpacity
                      style={{ marginTop: 15 }}
                      onPress={() => handleAñadirPress("postre")}
                    >
                      <Text style={styles.text_legend}>
                        SELECCIONAR PICTOGRÁMA:
                      </Text>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={{
                            uri: arasaacService.getPictogramaId(postreId),
                          }}
                          style={[
                            styles.imageBase,
                            { borderWidth: 1, borderRadius: 5 },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {error && (
                <Text
                  style={[
                    styles.error,
                    { fontSize: scaleFont(20), marginTop: 10 },
                  ]}
                >
                  {mensajeValue}
                </Text>
              )}
              <View style={styles.navigationButtons}>
                <Boton
                  uri="atras"
                  onPress={handleAtrasPress}
                  dissable={view === 0}
                />
                {view < 3 ? (
                  <Boton uri="delante" onPress={handleSiguentePress} />
                ) : (
                  <Boton
                    uri="ok"
                    nameBottom="GUARDAR.MENÚ"
                    onPress={handleGuardarMenu}
                  />
                )}
              </View>
            </>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaProvider>
  );
}
