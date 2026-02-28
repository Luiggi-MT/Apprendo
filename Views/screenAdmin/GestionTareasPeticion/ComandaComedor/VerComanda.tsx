import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import Boton from "../../../../components/Boton";
import * as Sharing from "expo-sharing";
import Buscador from "../../../../components/Buscador";
import None from "../../../../components/None";
import TarjetaDescipcion from "../../../../components/TarjetaDescripcion";

export default function VerComanda({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { fecha } = route.params;

  const [aulas, setAulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const itemsPerPage = 3; // Coincide con tu limit inicial

  const api = new ConnectApi();

  const totalPaginas = Math.ceil(total / itemsPerPage) || 1;
  const paginaActual = Math.floor(offset / itemsPerPage) + 1;

  const cargarDatos = async (newOffset: number) => {
    setLoading(true);
    try {
      const data = await api.getAulasComandaPorFecha(
        fecha,
        newOffset,
        itemsPerPage,
      );

      if (data && Array.isArray(data.aulas)) {
        setAulas(data.aulas);
        // Actualizamos total si el backend lo devuelve, si no puedes poner un número fijo
        setTotal(data.total || 0);
      } else {
        setAulas([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error al cargar aulas:", error);
      setAulas([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos(0);
  }, [fecha]);

  const handleSiguientePress = () => {
    const nextOffset = offset + itemsPerPage;
    setOffset(nextOffset);
    cargarDatos(nextOffset);
  };

  const handleAtrasPress = () => {
    const prevOffset = Math.max(0, offset - itemsPerPage);
    setOffset(prevOffset);
    cargarDatos(prevOffset);
  };

  const handleAulaPress = (id_aula: number, nombre: string) => {
    navigation.navigate("DetalleComandaAula", {
      id_aula,
      fecha,
      nombre_aula: nombre,
    });
  };

  const handleDescargar = async () => {
    setLoading(true);
    await api.downloadComandaPDF(fecha);
    setLoading(false);
  };

  const atras = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#F5F5F5" }}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="AULAS.COMANDA"
        uriPictograma="comanda"
        style={scaleFont(25)}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <Buscador nameBuscador="BUSCAR AULA" onPress={() => {}} />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF8C42"
            style={{ marginTop: 50 }}
          />
        ) : aulas.length === 0 ? (
          <None description="NO HAY AULAS" uri="aula" />
        ) : (
          <View
            style={[
              styles.content,
              styles.shadow,
              { marginHorizontal: 15, padding: 15, borderRadius: 20 },
            ]}
          >
            {aulas.map((aula) => (
              <View key={aula.id} style={{ marginBottom: 10 }}>
                <TarjetaDescipcion
                  name={aula.nombre_aula}
                  description="VER.DETALLES"
                  navigation={() => handleAulaPress(aula.id, aula.nombre_aula)}
                />
              </View>
            ))}

            <View
              style={[
                styles.navigationButtons,
                {
                  paddingVertical: 10,
                  backgroundColor: "transparent",
                  marginTop: 10,
                },
              ]}
            >
              <Boton
                uri="atras"
                onPress={handleAtrasPress}
                dissable={offset === 0}
              />

              <View style={{ justifyContent: "center" }}>
                <Text
                  style={[
                    styles.text_legend,
                    { fontSize: scaleFont(22), color: "#333" },
                  ]}
                >
                  {paginaActual} / {totalPaginas}
                </Text>
              </View>
              <Boton
                uri="delante"
                onPress={handleSiguientePress}
                dissable={aulas.length <= itemsPerPage}
              />
            </View>
          </View>
        )}

        {!loading && aulas.length > 0 && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Boton
              uri="impresora"
              nameBottom="DESCARGAR.PDF"
              onPress={handleDescargar}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}
