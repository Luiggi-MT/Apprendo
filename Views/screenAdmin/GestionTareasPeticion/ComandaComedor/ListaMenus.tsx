import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import { scaleFont, styles } from "../../../../styles/styles";
import { Image, Text, View } from "react-native";
import Buscador from "../../../../components/Buscador";
import { Menu } from "../../../../class/Interface/Menu";
import { ConnectApi } from "../../../../class/Connect.Api/ConnectApi";
import { Arasaac } from "../../../../class/Arasaac/getPictograma";
import Boton from "../../../../components/Boton";
import { Formatear } from "../../../../class/Formatear/Formatear";
import TarjetaDescipcion from "../../../../components/TarjetaDescripcion";
export default function ComandaComedor({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(3);
  const [date, setDate] = useState<string>("");

  const api = new ConnectApi();
  const arassacService = new Arasaac();

  const { fecha } = route.params;

  const handleBuscadorPress = (searchText: string) => {};

  const handleCreaPress = () => {
    navigation.navigate("CrearMenu", { fecha: fecha });
  };
  const handleDetallePress = (id: number) => {
    navigation.navigate("DetalleMenu", { menu_id: id });
  };
  const atras = () => {
    navigation.goBack();
  };

  const handleVerComandaPress = () => {
    navigation.navigate("VerComanda", { fecha: fecha });
  };
  useEffect(() => {
    api.getMenu(offset, limit, fecha).then((data) => {
      setMenus(data.menus || []);
      setOffset(data.offset);
      setLimit(data.count);
    });

    if (fecha) {
      setDate(Formatear.formatearFecha(fecha));
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="LISTA.MENÚS"
        uriPictograma="pollo"
        style={scaleFont(36)}
      />
      <View
        style={{ justifyContent: "center", alignItems: "center", margin: 10 }}
      >
        <Text style={[styles.text_legend, { fontSize: 30 }]}>{date}</Text>
      </View>
      <Buscador nameBuscador="BUSCAR MENÚ" onPress={handleBuscadorPress} />

      <View style={[styles.content, styles.shadow]}>
        {menus.length === 0 ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[styles.text_legend, { textAlign: "center" }]}>
              NO HAY MENÚS DISPONIBLES
            </Text>
            <View style={styles.superPuesto}>
              <Image
                source={{ uri: arassacService.getPictograma("pollo") }}
                style={styles.imageBase}
              />
              <Image
                source={{ uri: arassacService.getPictograma("fallo") }}
                style={styles.imageOverlay}
              />
            </View>
          </View>
        ) : (
          <View>
            {menus.map((menu: Menu) => (
              <TarjetaDescipcion
                key={menu.id}
                uri={arassacService.getPictogramaId(menu.id_pictograma)}
                tachado={menu.tachado}
                name={menu.descripcion}
                style={{ fontSize: 13, margin: 2 }}
                description="VER.DETALLES"
                navigation={() => handleDetallePress(menu.id)}
              />
            ))}
          </View>
        )}
      </View>
      <View style={styles.navigationButtons}>
        <Boton uri="mas" nameBottom="CREAR.MENÚ" onPress={handleCreaPress} />
        <Boton
          uri="comanda"
          nameBottom="VER.COMANDA"
          onPress={handleVerComandaPress}
        />
      </View>
    </SafeAreaProvider>
  );
}
