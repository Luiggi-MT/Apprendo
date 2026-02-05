import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../../class/context/UserContext";
import { Students } from "../../../class/Interface/Students";
import { Speak } from "../../../class/Speak/Speak";
import Boton from "../../../components/Boton";

export default function ComandaAula({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { aula, fecha } = route.params;

  const [todosLosPlatos, setTodosLosPlatos] = useState<any[]>([]);
  const [menuActivo, setMenuActivo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});
  const [enviando, setEnviando] = useState(false);

  const { user } = useContext(UserContext);
  const student = user as Students;

  const api = new ConnectApi();
  const arasaac = new Arasaac();
  const speak = new Speak();

  useEffect(() => {
    cargarMenu();
  }, []);

  useEffect(() => {
    if (student.asistenteVoz !== "none") {
      speak.hablar(
        "En la parte superior tienes los diferentes menús, seleccionalos para pedir la cantidad de cada uno de los platos",
      );
    }
  }, [student]);

  const cargarMenu = async () => {
    setLoading(true);
    // IMPORTANTE: Asegúrate de pasar aula.id_visita en la llamada a la API
    const res = await api.getMenuPorFecha(fecha, 100, 0, aula.id_visita);

    console.log(JSON.stringify(res, null, 2));

    if (res.platos && res.platos.length > 0) {
      setTodosLosPlatos(res.platos);
      setMenuActivo(res.platos[0].nombre_menu);

      // Mapeamos las cantidades guardadas al estado local
      const inicial: { [key: string]: number } = {};
      res.platos.forEach((p: any) => {
        if (p.cantidad_guardada > 0) {
          const key = `${p.id_menu}_${p.id_plato}`;
          inicial[key] = p.cantidad_guardada;
        }
      });
      setCantidades(inicial);
    }
    setLoading(false);
  };

  // Obtenemos los nombres de menús únicos para las pestañas
  const nombresMenus = [...new Set(todosLosPlatos.map((p) => p.nombre_menu))];

  // Filtramos platos según la pestaña activa
  const platosVisibles = todosLosPlatos.filter(
    (p) => p.nombre_menu === menuActivo,
  );

  const modificarCantidad = (
    idPlato: number,
    idMenu: number,
    delta: number,
  ) => {
    const key = `${idMenu}_${idPlato}`; // Clave única por menú y plato
    setCantidades((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  };

  const guardarPedido = async () => {
    setEnviando(true);
    // Convertimos el objeto de cantidades en una lista para el servidor
    const pedidos = Object.entries(cantidades)
      .filter(([_, cant]) => cant > 0)
      .map(([key, cant]) => {
        const [idMenu, idPlato] = key.split("_");
        return { id_menu: idMenu, id_plato: idPlato, cantidad: cant };
      });

    const res = await api.guardarVisitaAula(aula.id_visita, pedidos);
    if (res) navigation.goBack();
    setEnviando(false);
  };

  const renderPlato = ({ item }: { item: any }) => {
    const key = `${item.id_menu}_${item.id_plato}`;
    return (
      <View
        style={[
          styles.card,
          {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderLeftColor: "#4C80D7",
          },
        ]}
      >
        <Image
          source={{ uri: arasaac.getPictogramaId(item.id_pictograma) }}
          style={{ width: 70, height: 70, borderRadius: 10 }}
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={{ fontFamily: "escolar-bold", fontSize: scaleFont(18) }}>
            {item.nombre.toUpperCase()}
          </Text>
          <Text style={{ color: "#666" }}>{item.plato_tipo}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => modificarCantidad(item.id_plato, item.id_menu, -1)}
          >
            <Ionicons name="remove-circle" size={45} color="#FF8C42" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: scaleFont(22),
              fontWeight: "bold",
              minWidth: 35,
              textAlign: "center",
            }}
          >
            {cantidades[key] || 0}
          </Text>
          <TouchableOpacity
            onPress={() => modificarCantidad(item.id_plato, item.id_menu, 1)}
          >
            <Ionicons name="add-circle" size={45} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaProvider style={{ backgroundColor: "#F9F9F9" }}>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={() => navigation.goBack()}
        nameHeader={aula.nombre_aula}
        uriFoto={api.getFoto(aula.foto_profesor)}
        profesor={aula.nombre_profesor}
        uriApi={true}
        style={scaleFont(25)}
      />
      <View
        style={{
          backgroundColor: "#FFF",
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#DDD",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {nombresMenus.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMenuActivo(m)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: menuActivo === m ? "#4C80D7" : "#E0E0E0",
                borderRadius: 25,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: menuActivo === m ? "#FFF" : "#333",
                  fontWeight: "bold",
                  fontSize: scaleFont(14),
                }}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1, padding: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF8C42" />
        ) : (
          <FlatList
            data={platosVisibles}
            keyExtractor={(item) => `${item.id_menu}_${item.id_plato}`}
            renderItem={renderPlato}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No hay platos en este menú
              </Text>
            }
          />
        )}
      </View>
      <View style={{ margin: 30 }}>
        <Boton
          nameBottom="GUARDAR.COMANDA"
          uri="ok"
          onPress={guardarPedido}
          dissable={enviando}
        />
      </View>
    </SafeAreaProvider>
  );
}
