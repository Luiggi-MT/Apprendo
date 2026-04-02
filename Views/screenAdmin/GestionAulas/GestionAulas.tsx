import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { Image, Text, View } from "react-native";
import Buscador from "../../../components/Buscador";
import TarjetaDescipcion from "../../../components/TarjetaDescripcion";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { Aula } from "../../../class/Interface/Aula";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
import Boton from "../../../components/Boton";
export default function GestionAulas({ navigation }: { navigation: any }) {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [limit, setLimit] = useState<number>(3);
  const [offset, setOffset] = useState<number>(0);
  const [busqueda, setBusqueda] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  const api = new ConnectApi();
  const arassacService = new Arasaac();

  const totalPaginas = Math.ceil(total / limit) || 1;
  const paginaActual = offset <= limit ? 1 : Math.ceil(offset / limit);

  const atras = () => {
    navigation.goBack();
  };

  const handleCrearPress = () => {
    navigation.navigate("CrearAula");
  };
  const handleBuscarPress = (searchText: string) => {
    if (searchText.length === 0) {
      setBusqueda(false);
      api.getAulas(0, 3).then((response) => {
        setAulas(response.aulas);
        setOffset(response.offset);
      });
    } else {
      setBusqueda(true);
      setMessage(searchText);
      api.getAulaByName(searchText, 0, 3).then((response) => {
        setAulas(response.aulas);
        setOffset(response.offset);
      });
    }
  };
  const handleAtrasPress = () => {
    if (busqueda) {
      api
        .getAulaByName(message, Math.max(0, offset - 2 * api.getLimit()), limit)
        .then((response) => {
          setAulas(response.aulas);
          setOffset(response.offset);
        });
      return;
    }
    api
      .getAulas(Math.max(0, offset - 2 * api.getLimit()), limit)
      .then((response) => {
        setAulas(response.aulas);
        setOffset(response.offset);
      });
  };
  const handleDelantePress = () => {
    if (busqueda) {
      api.getAulaByName(message, offset, limit).then((response) => {
        setAulas(response.aulas);
        setOffset(response.offset);
      });
      return;
    }
    api.getAulas(offset, limit).then((response) => {
      setAulas(response.aulas);
      setOffset(response.offset);
    });
  };

  const handleNavigationPress = (aulaId: number) => {
    navigation.navigate("DetallesAula", { aulaId: aulaId });
  };
  useEffect(() => {
    api.getAulas(offset, limit).then((response) => {
      setAulas(response.aulas);
      setOffset(response.offset);
      setTotal(response.total);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="GESTIÓN.DE.AULAS"
        uriPictograma="aula"
        style={scaleFont(30)}
      />
      <Buscador nameBuscador="BUSCAR AULA" onPress={handleBuscarPress} />
      <View style={[styles.content, styles.shadow]}>
        {aulas.length === 0 && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={[
                styles.text,
                { fontSize: scaleFont(20), textAlign: "center" },
              ]}
            >
              NO HAY AULAS DISPONIBLES.
            </Text>
            <View style={[styles.superPuesto]}>
              <Image
                source={{ uri: arassacService.getPictograma("aula") }}
                style={styles.imageBase}
              />
              <Image
                source={{ uri: arassacService.getPictograma("fallo") }}
                style={styles.imageOverlay}
              />
            </View>
          </View>
        )}
        {aulas.length > 0 &&
          aulas.map((aula) => (
            <TarjetaDescipcion
              key={aula.id.toString()}
              name={aula.nombre}
              navigation={() => handleNavigationPress(aula.id)}
              description="VER.DETALLES"
              style={{ margin: 10 }}
            />
          ))}
        {aulas.length > 0 && (
          <View style={styles.navigationButtons}>
            <Boton
              uri="atras"
              onPress={handleAtrasPress}
              dissable={offset <= limit}
            />

            <Text
              style={[
                styles.text_legend,
                { fontSize: scaleFont(22), color: "#333" },
              ]}
            >
              {paginaActual} / {totalPaginas}
            </Text>

            <Boton
              uri="delante"
              onPress={handleDelantePress}
              dissable={offset >= total}
            />
          </View>
        )}
      </View>

      <Boton uri="mas" nameBottom="CREAR.AULA" onPress={handleCrearPress} />
    </SafeAreaProvider>
  );
}
