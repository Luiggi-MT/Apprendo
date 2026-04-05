import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { UserContext } from "../../../class/context/UserContext";
import Splash from "../../../components/Splash";

const PedidoMaterial = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { tareaId } = route.params;
  const [materiales, setMateriales] = useState<MaterialEscolarInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [limit, setLimit] = useState<number>(3);
  const [offset, setOffset] = useState<number>(0);
  const [busquedaActiva, setBusquedaActiva] = useState<boolean>(false);
  const [textoBusqueda, setTextoBusqueda] = useState<string>("");
  const cantidadesSeleccionadasRef = useRef<
    Record<number, { materialId: number; cantidad: number }>
  >({});
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");

  const profesor = useContext(UserContext).user;
  const arasaac = new Arasaac();
  const api = new ConnectApi();
  const insets = useSafeAreaInsets();
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

  const handleAtrasPress = () => {
    const newOffset = offset - limit;
    if (newOffset >= 0) {
      setOffset(newOffset);
      cargarMateriales(newOffset);
    }
  };
  const handleDelantePress = () => {
    const newOffset = offset + limit;
    if (newOffset < total) {
      setOffset(newOffset);
      cargarMateriales(newOffset);
    }
  };
  const handleBuscadorPress = (searchText: string) => {
    if (searchText.trim().length === 0) {
      setBusquedaActiva(false);
      setTextoBusqueda("");
      cargarMateriales(0);
    } else {
      setBusquedaActiva(true);
      setTextoBusqueda(searchText);
      cargarMaterialesBusqueda(0, searchText);
    }
  };
  const handleAsignarPress = () => {
    const materialesSeleccionados = Object.values(
      cantidadesSeleccionadasRef.current,
    ).filter((item) => item.cantidad > 0);

    if (materialesSeleccionados.length === 0) {
      setError("SELECCIONA AL MENOS UN MATERIAL");
      return;
    }
    setIsLoading(true);
    setMensaje("ASIGNANDO MATERIALES...");
    console.log(
      "Materiales seleccionados para asignar:",
      materialesSeleccionados,
    );
    api
      .asignarTareaPedidoMaterial(materialesSeleccionados, tareaId, profesor.id)
      .then((response) => {
        console.log("Respuesta de asignarTareaPedidoMaterial:", response);
        if (response === null) {
          setTimeout(() => {
            setIsLoading(false);
            setMensaje("");
            navigation.goBack();
          }, 2000);
        } else {
          setError(response.toUpperCase());
        }
      });
  };

  const handleCantidadMaterialChange = (
    materialId: number,
    cantidad: number,
  ) => {
    cantidadesSeleccionadasRef.current[materialId] = {
      materialId,
      cantidad,
    };
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
        nameHeader="PEDIDO.DEL.MATERIAL"
        uriPictograma="materialEscolar"
        style={scaleFont(26)}
      />
      {isLoading ? (
        <Splash name={mensaje} />
      ) : (
        <>
          <Buscador
            nameBuscador="BUSCAR MATERIAL"
            onPress={handleBuscadorPress}
          />
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
                    selectedCantidadInicial={
                      cantidadesSeleccionadasRef.current[material.id]
                        ?.cantidad ?? 0
                    }
                    onCantidadChange={(cantidadSeleccionada) =>
                      handleCantidadMaterialChange(
                        material.id,
                        cantidadSeleccionada,
                      )
                    }
                    style={{ fontSize: 13 }}
                    description="VER.DETALLES"
                    navigation={() => {}}
                  />
                ))}
                <View style={styles.navigationButtons}>
                  <Boton
                    uri="atras"
                    onPress={handleAtrasPress}
                    dissable={offset === 0}
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
                    dissable={offset + limit >= total}
                  />
                </View>
              </>
            )}
          </View>
          {error.length > 0 && (
            <View>
              <Text style={[styles.error, { fontSize: scaleFont(18) }]}>
                {error}
              </Text>
            </View>
          )}
          <View>
            <Boton
              uri="ok"
              onPress={handleAsignarPress}
              nameBottom="ASIGNAR.MATERIAL"
            />
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
};

export default PedidoMaterial;
