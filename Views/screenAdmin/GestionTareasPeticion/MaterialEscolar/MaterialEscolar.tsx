import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import Buscador from "../../../../components/Buscador";
import { Image, Text, View } from "react-native";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import Boton from "../../../../components/Boton";
import { MaterialEscolar as MaterialEscolarInterface } from "../../../../class/Interface/MaterialEscolar";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import TarjetaDescipcion from "../../../../components/TarjetaDescripcion";

const MaterialEscolar = ({ navigation }: { navigation: any }) => {
  const [materiales, setMateriales] = useState<MaterialEscolarInterface[]>([]);
  const [limit] = useState(3);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const insets = useSafeAreaInsets();

  const api = new ConnectApi();
  const arasaac = new Arasaac();
  const atras = () => navigation.goBack();
  const cargarMateriales = (newOffset: number) => {
    api.getMaterialesEcolares(newOffset, limit).then((data) => {
      setMateriales(data.materialesEscolares);
      setTotal(data.count);
      setTotalPaginas(Math.ceil(data.count / limit));
      setPaginaActual(Math.ceil(newOffset / limit) + 1);
    });
  };
  const cargarMaterialesBusqueda = (newOffset: number, seachText: string) => {
    api
      .getMaterialesEscolaresByName(seachText, newOffset, limit)
      .then((data) => {
        if (data !== null) {
          setMateriales(data.materialesEscolares);
          setTotal(data.count);
          setTotalPaginas(Math.ceil(data.count / limit));
          setPaginaActual(Math.ceil(newOffset / limit) + 1);
        } else {
          setMateriales([]);
          setTotal(0);
          setTotalPaginas(1);
          setPaginaActual(1);
        }
      });
  };
  const handleCreaPress = () => {
    navigation.navigate("CrearMaterial");
  };
  const handleAtrasPagina = () => {
    const newOffset = offset - limit;
    if (newOffset >= 0) {
      setOffset(newOffset);
      cargarMateriales(newOffset);
    }
  };
  const handleDelantePagina = () => {
    const newOffset = offset + limit;
    if (newOffset < total) {
      setOffset(newOffset);
      cargarMateriales(newOffset);
    }
  };

  const handleBuscadorPress = (seachText: string) => {
    if (seachText.trim().length === 0) {
      setBusquedaActiva(false);
      setTextoBusqueda("");
      cargarMateriales(0);
    } else {
      setBusquedaActiva(true);
      setTextoBusqueda(seachText);
      cargarMaterialesBusqueda(0, seachText);
    }
  };

  const handleDetallesPress = (materialId: number) => {
    navigation.navigate("DetallesMaterial", {
      materialId,
    });
  };

  useEffect(() => {
    cargarMateriales(0);
  }, []);

  useEffect(() => {
    const unsuscribre = navigation.addListener("focus", () => {
      cargarMateriales(0);
    });
    return unsuscribre;
  }, [navigation]);

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="MATERIAL.ESCOLAR"
        uriPictograma="materialEscolar"
        style={scaleFont(26)}
      />
      <Buscador nameBuscador="BUSCAR MATERIAL" onPress={handleBuscadorPress} />
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
              <TarjetaDescipcion
                key={material.id}
                uri={arasaac.getPictogramaId(material.pictogramaId)}
                name={material.nombre}
                style={{ fontSize: 13 }}
                description="VER.DETALLES"
                navigation={() => handleDetallesPress(material.id)}
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
      <View style={styles.navigationButtons}>
        <Boton
          uri="mas"
          nameBottom="CREAR.MATERIAL"
          onPress={handleCreaPress}
        />
        <Boton
          uri="tareasPeticion"
          nameBottom="CREAR.TAREA"
          onPress={() => {}}
        />
        <Boton
          uri="inventario"
          nameBottom="VER.INVENTARIO"
          onPress={() => {}}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default MaterialEscolar;
