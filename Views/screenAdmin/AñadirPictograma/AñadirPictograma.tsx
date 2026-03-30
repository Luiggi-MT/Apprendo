import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";
import Buscador from "../../../components/Buscador";
import Boton from "../../../components/Boton";
import { ArasaacPictogram } from "../../../class/Interface/ArasaacPictogram";
import { Arasaac } from "../../../class/Arasaac/getPictograma";

export default function AñadirPictograma({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [todosLosPictogramas, setTodosLosPictogramas] = useState<
    ArasaacPictogram[]
  >([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const tipoParam = route.params?.tipoParam;

  const itemsPorPagina = 4;

  const arasaacService = new Arasaac();

  const handleBuscadorPress = (word: string) => {
    arasaacService.searchPictograma(word).then((data) => {
      setTodosLosPictogramas(data);
      setPaginaActual(0);
    });
  };

  const pictogramasPaginados = todosLosPictogramas.slice(
    paginaActual * itemsPorPagina,
    (paginaActual + 1) * itemsPorPagina,
  );

  const siguientePagina = () => {
    if ((paginaActual + 1) * itemsPorPagina < todosLosPictogramas.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 0) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleSeleccionarPress = (item: ArasaacPictogram) => {
    if (route.params?.onSelect) {
      route.params.onSelect(item._id, tipoParam);
    }
    navigation.goBack();
  };

  const atras = () => navigation.goBack();

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="AÑADIR.PICTOGRÁMA"
        uriPictograma="añadirPictograma"
        style={scaleFont(20)}
      />

      <Buscador
        nameBuscador="BUSCAR PICTOGRÁMA"
        onPress={handleBuscadorPress}
      />

      <View style={[styles.content, styles.shadow]}>
        {todosLosPictogramas.length === 0 ? (
          <>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.text_legend}>NO HAY PICTOGRAMA</Text>
              <View style={styles.superPuesto}>
                <Image
                  source={{
                    uri: arasaacService.getPictograma("pictograma"),
                  }}
                  style={styles.imageBase}
                />
                <Image
                  source={{ uri: arasaacService.getPictograma("fallo") }}
                  style={styles.imageOverlay}
                />
              </View>
            </View>
          </>
        ) : (
          <FlatList
            key={2}
            data={pictogramasPaginados}
            numColumns={2}
            keyExtractor={(item) => item._id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  margin: 10,
                  padding: 5,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 10,
                }}
                onPress={() => handleSeleccionarPress(item)}
              >
                <Image
                  source={{ uri: arasaacService.getPictogramaId(item._id) }}
                  style={{ width: 120, height: 120 }}
                />
                <Text
                  style={[styles.text_legend, { fontSize: 16, marginTop: 5 }]}
                >
                  {item.keywords[0]?.keyword.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {todosLosPictogramas.length > 0 && (
        <View style={styles.navigationButtons}>
          <Boton
            uri="atras"
            onPress={paginaAnterior}
            dissable={paginaActual === 0}
          />

          <Text style={styles.text_legend}>
            {paginaActual + 1} /{" "}
            {Math.ceil(todosLosPictogramas.length / itemsPorPagina)}
          </Text>

          <Boton
            uri="delante"
            onPress={siguientePagina}
            dissable={
              (paginaActual + 1) * itemsPorPagina >= todosLosPictogramas.length
            }
          />
        </View>
      )}
    </SafeAreaProvider>
  );
}
