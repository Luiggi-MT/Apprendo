import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { Arasaac } from "../../../class/Arasaac/getPictograma";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../../class/context/UserContext";
import { Students } from "../../../class/Interface/Students";
import { Speak } from "../../../class/Speak/Speak";
import Boton from "../../../components/Boton";
import Buscador from "../../../components/Buscador";
import { tarjetaDescipcion_styles } from "../../../styles/tarjetaDescripcion_styles";
import { useFocusEffect } from "@react-navigation/native";
import { useVoice } from "../../../class/context/VoiceContext";

export default function ComandaAula({ navigation, route }: any) {
  const { aula, fecha, id_tarea_estudiante } = route.params;

  const [loading, setLoading] = useState(true);
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});
  const [enviando, setEnviando] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [vista, setVista] = useState<"menu" | "postre">("menu");
  const [isListening, setIsListening] = useState(false);

  const [limit] = useState(3);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);

  const isProcessing = useRef(false);

  const { user } = useContext(UserContext);
  const student = user as Students;

  const api = new ConnectApi();
  const arasaac = new Arasaac();
  const speak = Speak.getInstance();

  const totalPages = Math.ceil(count / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const voice = useVoice();

  const modificarCantidad = async (
    idPlato: number,
    idMenu: number,
    delta: number,
  ) => {
    const key = `${idMenu}_${idPlato}`;
    const newValue = Math.min(10, Math.max(0, (cantidades[key] || 0) + delta));
    setCantidades((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    // Anunciar la cantidad añadida si el asistente está habilitado
    if (student.asistenteVoz !== "none") {
      const menuItem = menus.find((m) => m.id === idMenu);
      if (menuItem) {
        await speak.hablar(`${menuItem.descripcion}: ${newValue}`);
      }
    }

    const response = await api.setCantidadPedido(
      id_tarea_estudiante,
      student.id,
      fecha,
      aula.id_visita,
      idMenu,
      idPlato,
      newValue,
    );
    if (!response) {
      console.error("Error al actualizar cantidad en el servidor");
    }
  };

  const activarAsistente = useCallback(async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setIsListening(true);
    try {
      await speak.hablar("Te escucho");
      const comando = (await voice.listenCommand()).toLocaleLowerCase();

      // Comando: cambiar a menús
      if (
        comando.includes("menú") ||
        comando.includes("menu") ||
        comando.includes("primer plato") ||
        comando.includes("segunda comida")
      ) {
        if (vista !== "menu") {
          setVista("menu");
          await speak.hablar("Mostrando menús");
        } else {
          await speak.hablar("Ya estamos en menús");
        }
      }
      // Comando: cambiar a postres
      else if (
        comando.includes("postre") ||
        comando.includes("postres") ||
        comando.includes("dulce") ||
        comando.includes("endulzante")
      ) {
        if (vista !== "postre") {
          setVista("postre");
          await speak.hablar("Mostrando postres");
        } else {
          await speak.hablar("Ya estamos en postres");
        }
      }
      // Comando: guardar/finalizar
      else if (
        comando.includes("guardar") ||
        comando.includes("finalizar") ||
        comando.includes("terminar") ||
        comando.includes("listo") ||
        comando.includes("hecho")
      ) {
        await speak.hablar("Guardando comanda");
        await guardarPedido();
        return;
      }
      // Comando: siguiente página
      else if (
        comando.includes("siguiente") ||
        comando.includes("próximo") ||
        comando.includes("siguiente página") ||
        comando.includes("adelante")
      ) {
        if (offset + limit < count) {
          handleDelantePress();
          await speak.hablar("Página siguiente");
        } else {
          await speak.hablar("Ya estás en la última página");
        }
      }
      // Comando: página anterior
      else if (
        comando.includes("anterior") ||
        comando.includes("atrás página") ||
        comando.includes("página anterior")
      ) {
        if (offset > 0) {
          handleAtrasPress();
          await speak.hablar("Página anterior");
        } else {
          await speak.hablar("Ya estás en la primera página");
        }
      }
      // Comando: buscar menú por nombre
      else {
        const menuEncontrado = menus.find((m) =>
          m.descripcion.toLowerCase().includes(comando),
        );

        if (menuEncontrado) {
          const idMenu = menuEncontrado.id;
          const idPlato = menuEncontrado.platos[0]?.id || 0;
          const key = `${idMenu}_${idPlato}`;
          const cantidadActual = cantidades[key] || 0;

          if (cantidadActual < 10) {
            await modificarCantidad(idPlato, idMenu, 1);
          } else {
            await speak.hablar("Cantidad máxima alcanzada");
          }
        } else {
          await speak.hablar(
            "No encontré ese elemento. Intenta decir el nombre del menú o postre",
          );
        }
      }
    } catch (error) {
      console.error("Error en asistente de voz:", error);
      await speak.hablar(
        "Lo siento, no te he entendido. Por favor, inténtalo de nuevo.",
      );
    } finally {
      isProcessing.current = false;
      setIsListening(false);

      // Reiniciar el asistente si está en modo bidireccional
      setTimeout(() => {
        if (student.asistenteVoz === "bidireccional") {
          voice.startWake(activarAsistente);
        }
      }, 1000);
    }
  }, [
    navigation,
    student,
    speak,
    voice,
    menus,
    cantidades,
    vista,
    offset,
    count,
    limit,
    modificarCantidad,
  ]);

  useEffect(() => {
    cargarMenu(0);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await voice.stopWake();
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (student.asistenteVoz !== "none") {
          await speak.hablar("Estás en la comanda de " + aula.nombre_aula);
          if (vista === "menu") {
            await speak.hablar("Selecciona el menú para hacer la comanda");
          } else {
            await speak.hablar("Selecciona los postres para hacer la comanda");
          }
        }
        if (student.asistenteVoz === "bidireccional") {
          await speak.hablar(
            "También puedes decir: postre para cambiar de categoría, guardar para finalizar, o siguiente para más opciones",
          );
          voice.startWake(activarAsistente);
        }
      };
      init();

      return () => {
        voice.stopWake();
      };
    }, [student, speak, voice, activarAsistente, vista, aula]),
  );

  useEffect(() => {
    setOffset(0);
    cargarMenu(0);
    // Anunciar cambio a postre si está habilitado el asistente
    if (vista === "postre" && student.asistenteVoz !== "none") {
      speak.hablar("Mostrando postres");
    }
  }, [vista, student.asistenteVoz, speak]);

  // --- Cargar menús con paginación ---
  const cargarMenu = async (nuevoOffset: number = 0) => {
    if (nuevoOffset < 0) nuevoOffset = 0;
    if (nuevoOffset >= count) nuevoOffset = Math.max(0, count - limit);

    setLoading(true);

    try {
      const res = await api.getMenusConCantidades(
        limit,
        nuevoOffset,
        id_tarea_estudiante,
        student.id,
        fecha,
        aula.id_visita,
        vista,
      );
      if (!res) {
        setMenus([]);
        setCount(0);
        setLoading(false);
        return;
      }

      setCount(res.total || res.menu.length);

      const nuevasCantidades: { [key: string]: number } = {};
      res.menu.forEach((menu: any) => {
        menu.platos.forEach((plato: any) => {
          const key = `${menu.id}_${plato.id}`;
          nuevasCantidades[key] = plato.cantidad;
        });
      });

      setCantidades(nuevasCantidades);
      setMenus(res.menu);
      setOffset(nuevoOffset);
    } catch (error) {
      console.error("Error cargando menús:", error);
      setMenus([]);
    }

    setLoading(false);
  };

  const handleBuscarMenu = async (
    search: string,
    categoria: "menu" | "postre",
  ) => {
    if (search.trim() === "") {
      cargarMenu(0);
      return;
    }

    setLoading(true);

    try {
      const res = await api.getMenusConCantidadesByName(
        limit,
        0,
        id_tarea_estudiante,
        student.id,
        fecha,
        aula.id_visita,
        search,
        categoria,
      );

      if (res && res.menu) {
        const nuevasCantidades: { [key: string]: number } = {};

        res.menu.forEach((menu: any) => {
          menu.platos.forEach((plato: any) => {
            const key = `${menu.id}_${plato.id}`;
            nuevasCantidades[key] = plato.cantidad;
          });
        });

        setCantidades(nuevasCantidades);
        setMenus(res.menu);
        setCount(res.total || res.menu.length);
        setOffset(0);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }

    setLoading(false);
  };

  const handleAtrasPress = () => {
    if (offset === 0) return;
    cargarMenu(offset - limit);
  };

  const handleDelantePress = () => {
    if (offset + limit >= count) return;
    cargarMenu(offset + limit);
  };

  const guardarPedido = async () => {
    setEnviando(true);

    const pedidos: any[] = [];

    menus.forEach((menu: any) => {
      menu.platos.forEach((plato: any) => {
        const key = `${menu.id}_${plato.id}`;
        const cantidad = cantidades[key] || 0;

        if (cantidad > 0) {
          pedidos.push({
            id_menu: menu.id,
            id_plato: plato.id,
            cantidad: Number(cantidad),
          });
        }
      });
    });

    try {
      const res = await api.guardarVisitaAula(
        id_tarea_estudiante,
        student.id,
        fecha,
        aula.id_visita,
      );

      if (res) navigation.goBack({ realizada: true });
    } catch (error) {
      console.error("Error al guardar:", error);
    }

    setEnviando(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const idMenu = item.id;
    const idReferenciaPlato = item.platos[0]?.id || 0;
    const key = `${idMenu}_${idReferenciaPlato}`;
    const cantidad = cantidades[key] || 0;

    return (
      <View
        style={[
          styles.card,
          {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderLeftColor: "#4C80D7",
            marginBottom: 10,
          },
        ]}
      >
        <View style={tarjetaDescipcion_styles.superPuesto}>
          <Image
            source={{ uri: arasaac.getPictogramaId(item.id_pictograma) }}
            style={tarjetaDescipcion_styles.imageTarjet}
          />
          {item.tachado === true && (
            <Image
              source={{ uri: arasaac.getPictograma("fallo") }}
              style={tarjetaDescipcion_styles.imageOverlay}
            />
          )}
        </View>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text
            style={{
              fontFamily: "escolar-bold",
              fontSize: scaleFont(18),
            }}
          >
            {item.descripcion}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            disabled={cantidad === 0}
            onPress={() => modificarCantidad(idReferenciaPlato, idMenu, -1)}
          >
            <Ionicons name="remove-circle" size={45} color="#FF8C42" />
          </TouchableOpacity>

          {student.accesibilidad.includes("pictogramas") ? (
            <Image
              source={{ uri: arasaac.getNumero(cantidad) }}
              style={{ width: 80, height: 80, marginHorizontal: 10 }}
            />
          ) : (
            <Text
              style={{
                fontSize: scaleFont(22),
                fontWeight: "bold",
                minWidth: 35,
                textAlign: "center",
              }}
            >
              {cantidad}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => modificarCantidad(idReferenciaPlato, idMenu, 1)}
          >
            <Ionicons name="add-circle" size={45} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={() => navigation.goBack()}
        nameHeader={aula.nombre}
        uriFoto={api.getFoto(aula.foto_profesor)}
        profesor={aula.nombre_profesor}
        uriApi={true}
        style={scaleFont(25)}
        vistaSelector={{ vista, setVista }}
      />

      <Buscador
        nameBuscador={vista === "menu" ? "BUSCAR MENÚ" : "BUSCAR POSTRE"}
        onPress={(searchText) => handleBuscarMenu(searchText, vista)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C42" />
      ) : (
        <FlatList
          data={menus}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No hay elementos para mostrar
            </Text>
          }
        />
      )}

      <View style={{ alignItems: "center", marginVertical: 5 }}>
        <Text style={{ fontSize: scaleFont(20), fontFamily: "escolar-bold" }}>
          {currentPage}/{totalPages}
        </Text>
      </View>

      <View style={styles.navigationButtons}>
        <Boton uri="atras" onPress={handleAtrasPress} dissable={offset === 0} />
        <Boton
          nameBottom="GUARDAR.COMANDA"
          uri="ok"
          onPress={guardarPedido}
          dissable={enviando}
        />
        <Boton
          uri="delante"
          onPress={handleDelantePress}
          dissable={offset + limit >= count}
        />
      </View>
    </SafeAreaProvider>
  );
}
