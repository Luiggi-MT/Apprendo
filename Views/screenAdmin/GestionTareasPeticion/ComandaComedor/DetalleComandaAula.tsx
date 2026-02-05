import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import Boton from "../../../../components/Boton"; // Reutilizamos tu componente Boton

export default function DetalleComandaAula({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { id_aula, fecha, nombre_aula } = route.params;

  const [todosLosPlatos, setTodosLosPlatos] = useState<any[]>([]);
  const [platosFiltrados, setPlatosFiltrados] = useState<any[]>([]);
  const [menusDisponibles, setMenusDisponibles] = useState<string[]>([]);
  const [menuSeleccionado, setMenuSeleccionado] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const api = new ConnectApi();
  const arasaac = new Arasaac();

  const cargarDetalle = async () => {
    setLoading(true);
    try {
      const data = await api.getComandaDetalladaPorFecha(fecha, id_aula);
      setTodosLosPlatos(data);

      const nombresMenus = [...new Set(data.map((item: any) => item.menu))];
      setMenusDisponibles(nombresMenus);

      if (nombresMenus.length > 0) {
        setMenuSeleccionado(nombresMenus[0]);
        const iniciales = data.filter(
          (item: any) => item.menu === nombresMenus[0],
        );
        setPlatosFiltrados(iniciales);
      }
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarMenu = (direccion: "atras" | "delante") => {
    const indiceActual = menusDisponibles.indexOf(menuSeleccionado);
    let nuevoIndice;

    if (direccion === "delante") {
      nuevoIndice = (indiceActual + 1) % menusDisponibles.length;
    } else {
      nuevoIndice =
        (indiceActual - 1 + menusDisponibles.length) % menusDisponibles.length;
    }

    const nuevoMenu = menusDisponibles[nuevoIndice];
    setMenuSeleccionado(nuevoMenu);
    const filtrados = todosLosPlatos.filter((item) => item.menu === nuevoMenu);
    setPlatosFiltrados(filtrados);
  };

  useEffect(() => {
    cargarDetalle();
  }, [id_aula, fecha]);

  return (
    <SafeAreaProvider style={{ backgroundColor: "#F5F5F5" }}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={() => navigation.goBack()}
        nameHeader="DETALLE.PLATOS"
        uriPictograma="comanda"
        style={scaleFont(25)}
      />

      <View style={localStyles.subHeader}>
        <Text style={localStyles.tituloAula}>{nombre_aula?.toUpperCase()}</Text>
      </View>

      {/* SELECTOR DE MENÚS CON FLECHAS DE ACCESIBILIDAD */}
      {!loading && menusDisponibles.length > 0 && (
        <View style={localStyles.containerAccesibilidad}>
          <Boton
            uri="atras"
            onPress={() => cambiarMenu("atras")}
            dissable={menusDisponibles.length <= 1}
          />

          <View style={localStyles.indicadorMenu}>
            <Text style={localStyles.textoMenuActivo}>
              {menuSeleccionado.toUpperCase()}
            </Text>
          </View>

          <Boton
            uri="delante"
            onPress={() => cambiarMenu("delante")}
            dissable={menusDisponibles.length <= 1}
          />
        </View>
      )}

      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF8C42"
            style={{ marginTop: 50 }}
          />
        ) : platosFiltrados.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.text_legend}>NO HAY PEDIDOS</Text>
          </View>
        ) : (
          <FlatList
            data={platosFiltrados}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ padding: 15 }}
            renderItem={({ item }) => (
              <View
                style={[styles.content, styles.shadow, localStyles.platoCard]}
              >
                <View style={localStyles.pictogramaContainer}>
                  <Image
                    source={{
                      uri: arasaac.getPictogramaId(item.id_pictograma),
                    }}
                    style={localStyles.pictograma}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={localStyles.platoNombre}>
                    {item.plato.toUpperCase()}
                  </Text>
                  <Text style={localStyles.menuNombre}>
                    {item.menu.toUpperCase()}
                  </Text>
                </View>
                <View style={localStyles.cantidadBadge}>
                  <Text style={localStyles.cantidadText}>{item.cantidad}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  subHeader: { backgroundColor: "#FFF", padding: 10, alignItems: "center" },
  tituloAula: {
    fontSize: scaleFont(18),
    fontFamily: "escolar-bold",
    color: "#4C80D7",
  },

  // Estilos del nuevo contenedor de flechas
  containerAccesibilidad: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
  },
  indicadorMenu: {
    flex: 1,
    backgroundColor: "#4C80D7",
    marginHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  textoMenuActivo: {
    fontFamily: "escolar-bold",
    fontSize: scaleFont(16),
    color: "#FFF",
    textAlign: "center",
  },

  platoCard: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    padding: 9,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#EEE",
  },
  pictogramaContainer: {
    padding: 5,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  pictograma: { width: 70, height: 70, borderRadius: 8 },
  platoNombre: {
    fontFamily: "escolar-bold",
    fontSize: scaleFont(18),
    color: "#333",
  },
  menuNombre: {
    color: "#777",
    fontFamily: "escolar",
    fontSize: scaleFont(14),
    marginTop: 4,
  },
  cantidadBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FF8C42",
    minWidth: 55,
    alignItems: "center",
  },
  cantidadText: {
    fontSize: scaleFont(20),
    fontFamily: "escolar-bold",
    color: "#FF8C42",
  },
});
