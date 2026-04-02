import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scaleFont, styles } from "../../../styles/styles";
import Header from "../../../components/Header";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { MaterialEscolar as MaterialEscolarInterface } from "../../../class/Interface/MaterialEscolar";
import Buscador from "../../../components/Buscador";
import TarjetaDescipcion from "../../../components/TarjetaDescripcion";
import Boton from "../../../components/Boton";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
import Descripcion from "../../../components/Descripcion";

const PedidoMaterial = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { tareaId } = route.params;
  const [materiales, setMateriales] = React.useState<
    MaterialEscolarInterface[]
  >([]);
  const [total, setTotal] = React.useState<number>(0);
  const [totalPaginas, setTotalPaginas] = React.useState<number>(0);
  const [paginaActual, setPaginaActual] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(3);
  const [offset, setOffset] = React.useState<number>(0);
  const arasaac = new Arasaac();
  const api = new ConnectApi();
  const insets = useSafeAreaInsets();
  const atras = () => navigation.goBack();

  const cargarMateriales = (newOffset: number) => {
    api.getMaterialesEcolares(newOffset, limit).then((data) => {
      console.log("Materiales escolares:", data.materialesEscolares);
      setMateriales(data.materialesEscolares);
      setTotal(data.count);
      setTotalPaginas(Math.ceil(data.count / limit));
      setPaginaActual(Math.ceil(newOffset / limit) + 1);
    });
  };

  useEffect(() => {
    cargarMateriales(0);
  }, []);

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="DETALLES.DEL.MATERIAL"
        uriPictograma="materialEscolar"
        style={scaleFont(26)}
      />
      <Buscador nameBuscador="BUSCAR MATERIAL" onPress={() => {}} />
      <View style={[styles.content, styles.shadow]}>
        {materiales.length === 0 ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[styles.text_legend]}>
              NO HAY MATERIALES DISPONIBLES
            </Text>
            <View style={styles.superPuesto}>
              <Image
                source={{ uri: arasaac.getPictograma("materialEscolar") }}
                style={styles.imageBase}
              />
              <Image
                source={{ uri: arasaac.getPictograma("fallo") }}
                style={[styles.imageOverlay]}
              />
            </View>
          </View>
        ) : (
          <>
            {materiales.map((material) => (
              <Descripcion
                key={material.id}
                uri={arasaac.getPictogramaId(material.pictogramaId)}
                name={material.nombre}
                cantidad={material.cantidad}
                style={{ fontSize: 13 }}
                description="VER.DETALLES"
                navigation={() => {}}
              />
            ))}
            <View style={styles.navigationButtons}>
              <Boton uri="atras" onPress={() => {}} dissable={offset === 0} />
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
                onPress={() => {}}
                dissable={offset + limit >= total}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default PedidoMaterial;
