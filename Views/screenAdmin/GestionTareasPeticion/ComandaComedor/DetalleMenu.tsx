import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { Menu } from "../../../../class/Interface/Menu";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Boton from "../../../../components/Boton";
import Splash from "../../../../components/Splash";
import { UserContext } from "../../../../class/context/UserContext";
import { Profesor } from "../../../../class/Interface/Profesor";

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
  const [postre, setPostre] = useState<string>("");
  const [postreId, setPostreId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mensajeValue, setMensajeValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [borrar, setBorrar] = useState<boolean>(false);

  const profesor = useContext(UserContext).user as Profesor;

  const { menu_id } = route.params;
  const api = new ConnectApi();
  const arasaacService = new Arasaac();

  const insets = useSafeAreaInsets();

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

  const handleModificarMenu = async () => {
    if (!menu) return;
    const updatedMenu: Menu = {
      id: menu.id,
      id_pictograma: pictogramaId,
      descripcion: descripcion,
      tachado: isTachado,
      categoria: menu.categoria,
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
    api
      .updateMenuById(updatedMenu)
      .then((response) => {
        setIsLoading(true);
        setMensajeValue("MODIFICANDO LOS DATOS DEL MENÚ");
        if (response.ok) {
          setTimeout(() => {
            setIsLoading(false);
            navigation.goBack({
              updateMenuId: menu_id,
            });
          }, 2000);
        } else {
          setIsLoading(false);
          setError(true);
          setMensajeValue("ERROR AL MODIFICAR EL MENÚ");
          setTimeout(() => {
            setError(false);
            setMensajeValue("");
          }, 2000);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
        setMensajeValue("ERROR AL MODIFICAR EL MENÚ");
        setTimeout(() => {
          setError(false);
          setMensajeValue("");
        }, 2000);
      });
  };

  const handleEliminarMenu = async () => {
    if (!menu) return;

    setIsLoading(true);
    setMensajeValue("ELIMINANDO MENÚ...");
    setError(false);

    try {
      const response = await api.deleteMenuById(menu.id);
      if (response.ok) {
        setMensajeValue("MENÚ ELIMINADO CON ÉXITO");

        setTimeout(() => {
          setIsLoading(false);
          navigation.goBack({
            deletedMenuId: menu_id,
          });
        }, 2000);
      } else {
        setIsLoading(false);
        setError(true);
        setMensajeValue(response.message || "ERROR AL ELIMINAR EL MENÚ");
        setTimeout(() => {
          setError(false);
          setMensajeValue("");
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
      setError(true);
      setMensajeValue("ERROR AL ELIMINAR EL MENÚ");
      setTimeout(() => {
        setError(false);
        setMensajeValue("");
      }, 2000);
    }
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
    if (menu.categoria === "menu") {
      switch (view) {
        case 0:
          return (
            <View>
              <TouchableOpacity
                onPress={() =>
                  profesor.tipo === "admin" && handleAñadirPress("menu")
                }
                disabled={profesor.tipo !== "admin"}
              >
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
                {profesor.tipo === "admin" && (
                  <>
                    <Text style={styles.text_legend}>TACHAR:</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                      onPress={() =>
                        profesor.tipo === "admin" && setIsTachado(!isTachado)
                      }
                      disabled={profesor.tipo !== "admin"}
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
                  </>
                )}
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
                  editable={profesor.tipo === "admin"}
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
                editable={profesor.tipo === "admin"}
              />
              <TouchableOpacity
                style={{ marginTop: 15 }}
                onPress={() =>
                  profesor.tipo === "admin" && handleAñadirPress("primerPlato")
                }
                disabled={profesor.tipo !== "admin"}
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
                editable={profesor.tipo === "admin"}
              />
              <TouchableOpacity
                style={{ marginTop: 15 }}
                onPress={() =>
                  profesor.tipo === "admin" && handleAñadirPress("segundoPlato")
                }
                disabled={profesor.tipo !== "admin"}
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
      }
    } else {
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
            editable={profesor.tipo === "admin"}
          />
          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() =>
              profesor.tipo === "admin" && handleAñadirPress("postre")
            }
            disabled={profesor.tipo !== "admin"}
          >
            <Text style={styles.text_legend}>SELECCIONAR PICTOGRÁMA:</Text>
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: arasaacService.getPictogramaId(postreId) }}
                style={[styles.imageBase, { borderWidth: 1, borderRadius: 5 }]}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
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
        <Splash name="CARGANDO MENÚS" />
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
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="DETALLE.MENÚ"
        uriPictograma="pollo"
        style={scaleFont(30)}
      />
      {isLoading ? (
        <Splash name={mensajeValue} />
      ) : (
        <>
          <View style={[styles.content, styles.shadow]}>
            <View>{renderContent()}</View>
          </View>
          <View style={styles.navigationButtons}>
            {menu.categoria == "menu" && (
              <>
                <Boton
                  uri="atras"
                  onPress={() => view > 0 && setView(view - 1)}
                  dissable={view === 0}
                />

                <Boton
                  uri="delante"
                  onPress={() => view < 2 && setView(view + 1)}
                  dissable={view === 2}
                />
              </>
            )}
          </View>

          {menu.categoria === "postre" ? (
            <>
              {error && (
                <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
                  {mensajeValue}
                </Text>
              )}
              {profesor.tipo === "admin" && (
                <>
                  {error && (
                    <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
                      {mensajeValue}
                    </Text>
                  )}

                  {borrar ? (
                    <View>
                      <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
                        QUIERES BORRAR EL MENÚ
                      </Text>
                      <View style={styles.navigationButtons}>
                        <Boton
                          uri="x"
                          nameBottom="NO ELIMINAR"
                          onPress={() => setBorrar(false)}
                        />
                        <Boton
                          uri="ok"
                          nameBottom="ELIMINAR"
                          onPress={handleEliminarMenu}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.navigationButtons}>
                      <Boton
                        uri="borrar"
                        nameBottom="ELIMINAR.MENÚ"
                        onPress={() => setBorrar(true)}
                      />
                      <Boton
                        uri="ok"
                        nameBottom="MODIFICAR.MENÚ"
                        onPress={handleModificarMenu}
                      />
                    </View>
                  )}
                </>
              )}
            </>
          ) : (
            view === 2 &&
            profesor.tipo === "admin" && (
              <>
                {error && (
                  <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
                    {mensajeValue}
                  </Text>
                )}
                {borrar ? (
                  <View>
                    <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
                      QUIERES BORRAR EL MENÚ
                    </Text>
                    <View style={styles.navigationButtons}>
                      <Boton
                        uri="x"
                        nameBottom="NO ELIMINAR"
                        onPress={() => setBorrar(false)}
                      />
                      <Boton
                        uri="ok"
                        nameBottom="ELIMINAR"
                        onPress={handleEliminarMenu}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.navigationButtons}>
                    <Boton
                      uri="borrar"
                      nameBottom="ELIMINAR.MENÚ"
                      onPress={() => setBorrar(true)}
                    />
                    <Boton
                      uri="ok"
                      nameBottom="MODIFICAR.MENÚ"
                      onPress={handleModificarMenu}
                    />
                  </View>
                )}
              </>
            )
          )}
        </>
      )}
    </SafeAreaProvider>
  );
}
