import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import Boton from "../../../../components/Boton";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";

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
  const [guarnicionId, setGuarnicionId] = useState<number>(0);

  const [isTachado, setIsTachado] = useState<boolean>(false);

  const [descripcion, setDescripcion] = useState<string>("");

  const [primerPlato, setPrimerPlato] = useState<string>("");
  const [segundoPlato, setSegundoPlato] = useState<string>("");
  const [postre, setPostre] = useState<string>("");
  const [guarnicion, setGuarnicion] = useState<string>("");

  const [view, setView] = useState<number>(0);
  const { fecha } = route.params;

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
        if (tipoAsignado === "guarnicion") setGuarnicionId(id);
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

  const handleGuarnicionChange = (word: string) => {
    setGuarnicion(word.toUpperCase());
  };

  const handleSiguentePress = () => {
    setView(view + 1);
  };
  const handleAtrasPress = () => {
    setView(view - 1);
  };
  const handleGuardarMenu = async () => {
    const response = await api.createMenu(
      fecha,
      pictogramaId,
      isTachado,
      descripcion,
      primerPlato,
      primerPlatoId,
      segundoPlato,
      segundoPlatoId,
      guarnicion,
      guarnicionId,
      postre,
      postreId,
    );
    if (response.ok) {
      alert("Menú creado con éxito");
      navigation.goBack();
    } else {
      alert("Error al crear el menú: " + response.message);
    }
  };
  const atras = () => navigation.goBack();

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="CREAR.MENÚ"
        uriPictograma="pollo"
        style={scaleFont(36)}
      />

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
                        uri: arasaacService.getPictogramaId(pictogramaId),
                      }}
                      style={[
                        styles.imageBase,
                        { borderWidth: 1, borderRadius: 5 },
                      ]}
                    />
                    <Image
                      source={{ uri: arasaacService.getPictograma("fallo") }}
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
            />
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => handleAñadirPress("primerPlato")}
            >
              <Text style={styles.text_legend}>SELECCIONAR PICTOGRÁMA:</Text>
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
            />
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => handleAñadirPress("segundoPlato")}
            >
              <Text style={styles.text_legend}>SELECCIONAR PICTOGRÁMA:</Text>
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
            <Text style={styles.text_legend}>GUARNICIÓN:</Text>
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
              placeholder="EJEMPLO: ENSALADA..."
              onChangeText={handleGuarnicionChange}
              value={guarnicion}
            />
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => handleAñadirPress("guarnicion")}
            >
              <Text style={styles.text_legend}>SELECCIONAR PICTOGRÁMA:</Text>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{
                    uri: arasaacService.getPictogramaId(guarnicionId),
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
        {view === 4 && (
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
              placeholder="EJEMPLO: YOGURT..."
              onChangeText={handlePostreChange}
              value={postre}
            />
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => handleAñadirPress("postre")}
            >
              <Text style={styles.text_legend}>SELECCIONAR PICTOGRÁMA:</Text>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: arasaacService.getPictogramaId(postreId) }}
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
      <View style={styles.navigationButtons}>
        <Boton uri="atras" onPress={handleAtrasPress} dissable={view === 0} />
        {view !== 4 ? (
          <Boton
            uri="delante"
            onPress={handleSiguentePress}
            dissable={view === 4}
          />
        ) : (
          <Boton
            uri="ok"
            nameBottom="GUARDAR.MENÚ"
            onPress={handleGuardarMenu}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}
