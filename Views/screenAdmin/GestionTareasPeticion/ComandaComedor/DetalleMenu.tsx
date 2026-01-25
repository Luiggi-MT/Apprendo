import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { Menu } from "../../../../class/Interface/Menu";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Boton from "../../../../components/Boton";

function Splash() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
      <ActivityIndicator size="large" color="#FF8C42" />
      <Text
        style={[
          styles.text,
          {
            marginTop: 20,
            fontSize: scaleFont(18),
            fontWeight: "bold",
            color: "#333",
          },
        ]}
      >
        CARGANDO MENÚ...
      </Text>
    </View>
  );
}

export default function DetalleMenu({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<number>(0);
  const [isTachado, setIsTachado] = useState<boolean>(false);
  const [pictogramaId, setPictogramaId] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");

  const [primerPlato, setPrimerPlato] = useState<string>("");
  const [primerPlatoId, setPrimerPlatoId] = useState<number>(0);
  const [segundoPlato, setSegundoPlato] = useState<string>("");
  const [segundoPlatoId, setSegundoPlatoId] = useState<number>(0);
  const [guarnicion, setGuarnicion] = useState<string>("");
  const [guarnicionId, setGuarnicionId] = useState<number>(0);
  const [postre, setPostre] = useState<string>("");
  const [postreId, setPostreId] = useState<number>(0);

  const { menu_id } = route.params;
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

  const handleModificarMenu = async () => {
    if (!menu) return;
    api
      .updateMenuById(
        menu.id,
        menu.fecha,
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
      )
      .then((response) => {
        if (response.ok) {
          navigation.goBack();
        } else {
          alert("ERROR AL MODIFICAR EL MENÚ");
        }
      })
      .catch(() => {
        alert("ERROR AL MODIFICAR EL MENÚ");
      });
  };

  const atras = () => navigation.goBack();

  useEffect(() => {
    api
      .getMenuById(menu_id)
      .then((data) => {
        const m = data.menu;
        if (!m) {
          setMenu(null);
          setLoading(false);
          return;
        }

        setMenu(m);
        setPictogramaId(m.id_pictograma);
        setDescripcion(m.descripcion);
        setIsTachado(m.tachado || m.tachado === true);

        m.platos.forEach((plato: any) => {
          switch (plato.categoria) {
            case "primero":
              setPrimerPlato(plato.nombre);
              setPrimerPlatoId(plato.id_pictograma);
              break;
            case "segundo":
              setSegundoPlato(plato.nombre);
              setSegundoPlatoId(plato.id_pictograma);
              break;
            case "guarnicion":
              setGuarnicion(plato.nombre);
              setGuarnicionId(plato.id_pictograma);
              break;
            case "postre":
              setPostre(plato.nombre);
              setPostreId(plato.id_pictograma);
              break;
          }
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [menu_id]);

  const renderContent = () => {
    switch (view) {
      case 0:
        return (
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
              <Text style={styles.text_legend}>DESCRIPCIÓN:</Text>
              <TextInput
                style={[
                  styles.buscador,
                  styles.shadow,
                  { textAlign: "left", paddingHorizontal: 15, height: 50 },
                ]}
                placeholder="EJEMPLO CON CARNE..."
                onChangeText={setDescripcion}
                value={descripcion}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.text_legend}>PRIMER PLATO:</Text>
            <TextInput
              style={[
                styles.buscador,
                styles.shadow,
                { textAlign: "left", paddingHorizontal: 15, height: 50 },
              ]}
              placeholder="EJEMPLO: POLLO CON ARROZ..."
              onChangeText={setPrimerPlato}
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
        );
      case 2:
        return (
          <View>
            <Text style={styles.text_legend}>SEGUNDO PLATO:</Text>
            <TextInput
              style={[
                styles.buscador,
                styles.shadow,
                { textAlign: "left", paddingHorizontal: 15, height: 50 },
              ]}
              placeholder="EJEMPLO: PESCADO CON PATATAS..."
              onChangeText={setSegundoPlato}
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
        );
      case 3:
        return (
          <View>
            <Text style={styles.text_legend}>GUARNICIÓN:</Text>
            <TextInput
              style={[
                styles.buscador,
                styles.shadow,
                { textAlign: "left", paddingHorizontal: 15, height: 50 },
              ]}
              placeholder="EJEMPLO: ENSALADA..."
              onChangeText={setGuarnicion}
              value={guarnicion}
            />
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => handleAñadirPress("guarnicion")}
            >
              <Text style={styles.text_legend}>SELECCIONAR PICTOGRÁMA:</Text>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: arasaacService.getPictogramaId(guarnicionId) }}
                  style={[
                    styles.imageBase,
                    { borderWidth: 1, borderRadius: 5 },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.text_legend}>POSTRE:</Text>
            <TextInput
              style={[
                styles.buscador,
                styles.shadow,
                { textAlign: "left", paddingHorizontal: 15, height: 50 },
              ]}
              placeholder="EJEMPLO: YOGURT..."
              onChangeText={setPostre}
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
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <Header
          uri="volver"
          nameBottom="ATRÁS"
          navigation={atras}
          nameHeader="DETALLE.MENÚ"
          uriPictograma="pollo"
          style={scaleFont(30)}
        />
        <Splash />
      </SafeAreaProvider>
    );
  }

  if (!menu) {
    return (
      <SafeAreaProvider>
        <Header
          uri="volver"
          nameBottom="ATRÁS"
          navigation={atras}
          nameHeader="DETALLE.MENÚ"
          uriPictograma="pollo"
          style={scaleFont(30)}
        />
        <View
          style={[
            styles.content,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.text_legend}>NO SE PUDO CARGAR EL MENÚ</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="DETALLE.MENÚ"
        uriPictograma="pollo"
        style={scaleFont(30)}
      />
      <View style={[styles.content, styles.shadow]}>
        <View>{renderContent()}</View>
      </View>
      <View style={styles.navigationButtons}>
        <Boton
          uri="atras"
          onPress={() => view > 0 && setView(view - 1)}
          dissable={view === 0}
        />
        {view !== 4 ? (
          <Boton
            uri="delante"
            onPress={() => view < 4 && setView(view + 1)}
            dissable={view === 4}
          />
        ) : (
          <Boton
            uri="ok"
            nameBottom="MODIFICAR"
            onPress={handleModificarMenu}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}
