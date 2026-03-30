import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Buscador from "../../../../components/Buscador";
import { Menu } from "../../../../class/Interface/Menu";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import Boton from "../../../../components/Boton";
import TarjetaDescipcion from "../../../../components/TarjetaDescripcion";
import { UserContext } from "../../../../class/context/UserContext";
import Splash from "../../../../components/Splash";
import { Profesor } from "../../../../class/Interface/Profesor";

export default function ComandaComedor({ navigation }: { navigation: any }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [total, setTotal] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);

  const [busquedaActiva, setBusquedaActiva] = useState<boolean>(false);
  const [textoBusqueda, setTextoBusqueda] = useState<string>("");

  const [esCreada, setEsCreada] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<boolean>(false);
  const [mensajeValue, setMensajeValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState<boolean>(false);
  const [vista, setVista] = useState<"menu" | "postre">("menu");

  const profesor = useContext(UserContext).user as Profesor;

  const api = new ConnectApi();
  const arassacService = new Arasaac();

  const cargarMenus = (newOffset: number, categoria: "menu" | "postre") => {
    api.getMenu(newOffset, limit, categoria).then((data) => {
      setMenus(data.menus || []);
      setOffset(newOffset);
      setTotal(data.count);

      const paginas = Math.ceil(data.count / limit) || 1;
      setTotalPaginas(paginas);
      setPaginaActual(Math.floor(newOffset / limit) + 1);
    });
  };

  const cargarMenusBusqueda = (
    newOffset: number,
    texto: string,
    vista: "menu" | "postre",
  ) => {
    api.getMenuByName(texto, newOffset, limit, vista).then((data) => {
      if (data !== null) {
        setMenus(data.menus || []);
        setOffset(newOffset);
        setTotal(data.count || 0);

        const paginas = Math.ceil(data.count / limit) || 1;
        setTotalPaginas(paginas);
        setPaginaActual(Math.floor(newOffset / limit) + 1);
      } else {
        setMenus([]);
        setOffset(0);
        setTotal(0);
        setTotalPaginas(1);
        setPaginaActual(1);
      }
    });
  };

  const handleBuscadorPress = (
    searchText: string,
    vista: "menu" | "postre",
  ) => {
    if (searchText.trim().length === 0) {
      setBusquedaActiva(false);
      setTextoBusqueda("");
      cargarMenus(0, vista);
    } else {
      setBusquedaActiva(true);
      setTextoBusqueda(searchText);
      cargarMenusBusqueda(0, searchText, vista);
    }
  };

  const handleAtrasPagina = () => {
    const newOffset = offset - limit;
    if (newOffset >= 0) {
      busquedaActiva
        ? cargarMenusBusqueda(newOffset, textoBusqueda, vista)
        : cargarMenus(newOffset, vista);
    }
  };

  const handleDelantePagina = () => {
    const newOffset = offset + limit;
    if (newOffset < total) {
      busquedaActiva
        ? cargarMenusBusqueda(newOffset, textoBusqueda, vista)
        : cargarMenus(newOffset, vista);
    }
  };

  const checkTarea = async () => {
    const response = await api.getTareaComanda();
    setEsCreada(response);
  };

  const handleCrearTareaPress = async () => {
    setMensaje(false);
    setIsLoading(true);
    setError(false);

    const response = await api.createTareaComanda();

    setTimeout(() => {
      setIsLoading(false);
      if (!response) {
        setError(true);
        setMensajeValue("NO SE HA PODIDO CREAR LA TAREA");
      } else {
        setMensaje(true);
        setMensajeValue("LA TAREA SE HA CREADO EXITOSAMENTE");
        setTimeout(() => setMensaje(false), 2000);
      }
    }, 1500);
  };

  const handleEliminarTareaPress = async () => {
    setConfirmarBorrado(false);
    setIsLoading(true);
    setError(false);

    const response = await api.deleteTareaComanda();

    setTimeout(() => {
      setIsLoading(false);
      if (!response) {
        setError(true);
        setMensajeValue("NO SE HA PODIDO ELIMINAR LA TAREA");
      } else {
        setMensaje(true);
        setMensajeValue("LA TAREA SE HA ELIMINADO EXITOSAMENTE");
        setTimeout(() => setMensaje(false), 2000);
      }
    }, 1500);
  };

  const handleCreaPress = () => navigation.navigate("CrearMenu");
  const handleDetallePress = (id: number) =>
    navigation.navigate("DetalleMenu", { menu_id: id });
  const atras = () => navigation.goBack();
  const handleVerComandaPress = () => navigation.navigate("ComandaComedor");

  useEffect(() => {
    cargarMenus(0, vista);
  }, []);

  useEffect(() => {
    checkTarea();
  }, [isLoading]);

  useEffect(() => {
    const unsuscribre = navigation.addListener("focus", () => {
      cargarMenus(0, vista);
    });
    return unsuscribre;
  }, [navigation]);

  useEffect(() => {
    cargarMenus(0, vista);
  }, [vista]);
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <View>
        <Header
          uri="volver"
          nameBottom="ATRÁS"
          navigation={atras}
          nameHeader="LISTA.DE.MENÚS"
          uriPictograma="pollo"
          style={scaleFont(30)}
          vistaSelector={{ vista, setVista }}
        />

        {isLoading ? (
          <Splash name="PROCESANDO..." />
        ) : (
          <>
            {vista === "menu" && (
              <Buscador
                nameBuscador="BUSCAR MENÚ"
                onPress={(searchText) =>
                  handleBuscadorPress(searchText, "menu")
                }
              />
            )}
            {vista === "postre" && (
              <Buscador
                nameBuscador="BUSCAR POSTRE"
                onPress={(searchText) =>
                  handleBuscadorPress(searchText, "postre")
                }
              />
            )}

            <View style={[styles.content, styles.shadow]}>
              {menus.length == 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text_legend]}>
                    NO HAY MENÚS DISPONIBLES
                  </Text>
                  <View style={styles.superPuesto}>
                    <Image
                      source={{
                        uri: arassacService.getPictograma("pollo"),
                      }}
                      style={styles.imageBase}
                    />
                    <Image
                      source={{ uri: arassacService.getPictograma("fallo") }}
                      style={styles.imageOverlay}
                    />
                  </View>
                </View>
              ) : (
                <>
                  {menus.map((menu: Menu) => (
                    <TarjetaDescipcion
                      key={menu.id}
                      uri={arassacService.getPictogramaId(menu.id_pictograma)}
                      tachado={menu.tachado}
                      name={menu.descripcion}
                      style={{ fontSize: 13 }}
                      description="VER.DETALLES"
                      navigation={() => handleDetallePress(menu.id)}
                    />
                  ))}

                  <View style={styles.navigationButtons}>
                    <Boton
                      uri="atras"
                      onPress={handleAtrasPagina}
                      dissable={offset === 0}
                    />

                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: scaleFont(20),
                          marginHorizontal: 10,
                        },
                      ]}
                    >
                      {paginaActual} / {totalPaginas}
                    </Text>

                    <Boton
                      uri="delante"
                      onPress={handleDelantePagina}
                      dissable={offset + limit >= total}
                    />
                  </View>
                </>
              )}
            </View>

            {mensaje && (
              <Text
                style={[
                  styles.text_legend,
                  { textAlign: "center", color: "green" },
                ]}
              >
                {mensajeValue}
              </Text>
            )}

            {error && (
              <Text style={[styles.error, { textAlign: "center" }]}>
                {mensajeValue}
              </Text>
            )}

            {profesor.tipo === "admin" &&
              (confirmarBorrado ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.error, { fontSize: scaleFont(20) }]}>
                    ¿SEGURO QUE QUIERES BORRAR LA TAREA?
                  </Text>
                  <View style={styles.navigationButtons}>
                    <Boton
                      uri="x"
                      nameBottom="NO ELIMINAR"
                      onPress={() => setConfirmarBorrado(false)}
                    />
                    <Boton
                      uri="ok"
                      nameBottom="SI, ELIMINAR"
                      onPress={handleEliminarTareaPress}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.navigationButtons}>
                  <Boton
                    uri="mas"
                    nameBottom="CREAR.MENÚ"
                    onPress={handleCreaPress}
                  />

                  {!esCreada ? (
                    <Boton
                      uri="tareasPeticion"
                      nameBottom="CREAR.TAREA"
                      onPress={handleCrearTareaPress}
                    />
                  ) : (
                    <Boton
                      uri="tareasPeticion"
                      nameBottom="ELIMINAR.TAREA"
                      onPress={() => setConfirmarBorrado(true)}
                    />
                  )}

                  <Boton
                    uri="comanda"
                    nameBottom="VER.COMANDA"
                    onPress={handleVerComandaPress}
                  />
                </View>
              ))}
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}
