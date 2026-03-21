import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import Header from "../../components/Header";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";
import { scaleFont, styles } from "../../styles/styles";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { Speak } from "../../class/Speak/Speak";
import { useVoice } from "../../class/context/VoiceContext";

export default function MensualScreen({ navigation }: { navigation: any }) {
  const { user } = useContext(UserContext);
  const student = user as Students;

  const [marcas, setMarcas] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const api = new ConnectApi();
  const speak = Speak.getInstance();
  const semanales: boolean = true;

  const isProcessing = useRef(false);
  const [isListening, setIsListening] = useState(false);

  const voice = useVoice();

  let mes;
  let resumen;
  const obtenerPrimeraFechaPendiente = (resumen: any): string | null => {
    // Ordenamos las fechas cronológicamente
    const fechas = Object.keys(resumen).sort();

    for (const fecha of fechas) {
      if (!resumen[fecha].todas_hechas) {
        return fecha; // primera fecha con tareas pendientes
      }
    }

    return null; // todas completadas
  };

  // ================= ASISTENTE =================

  const numerosDelMes = {
    uno: "01",
    dos: "02",
    tres: "03",
    cuatro: "04",
    cinco: "05",
    seis: "06",
    siete: "07",
    ocho: "08",
    nueve: "09",
    diez: "10",
    once: "11",
    doce: "12",
    trece: "13",
    catorce: "14",
    quince: "15",
    dieciséis: "16",
    dieciseis: "16",
    diecisiete: "17",
    dieciocho: "18",
    diecinueve: "19",
    veinte: "20",
    veintiuno: "21",
    veintidós: "22",
    veintidos: "22",
    veintitrés: "23",
    veintitres: "23",
    veinticuatro: "24",
    veinticinco: "25",
    veintiséis: "26",
    veintiseis: "26",
    veintisiete: "27",
    veintiocho: "28",
    veintinueve: "29",
    treinta: "30",
    treintayuno: "31",
  };

  const obtenerFechaDelComando = (comando: string): string | null => {
    // Buscar números del 1 al 31
    for (let i = 1; i <= 31; i++) {
      if (comando.includes(i.toString())) {
        const mesActual = new Date()
          .toISOString()
          .split("T")[0]
          .substring(0, 7);
        const diaFormato = String(i).padStart(2, "0");
        return `${mesActual}-${diaFormato}`;
      }
    }

    // Buscar nombres de números
    for (const [nombre, numero] of Object.entries(numerosDelMes)) {
      if (comando.includes(nombre)) {
        const mesActual = new Date()
          .toISOString()
          .split("T")[0]
          .substring(0, 7);
        return `${mesActual}-${numero}`;
      }
    }

    return null;
  };

  const activarAsistente = useCallback(async () => {
    if (isProcessing.current) {
      console.log("⚠️ Asistente ocupado");
      return;
    }
    isProcessing.current = true;
    setIsListening(true);

    try {
      await speak.hablar("Te escucho"); // primero hablamos

      const comando = (await voice.listenCommand()).toLocaleLowerCase();

      if (comando.includes("vamos")) {
        const fechaPendiente = obtenerPrimeraFechaPendiente(resumen);
        if (!fechaPendiente) {
          await speak.hablar("¡Felicidades! No tienes tareas pendientes.");
        } else {
          await speak.hablar(
            `Vamos a realizar la primera tarea pendiente del ${speak.formatearFechaVerbal(fechaPendiente)}`,
          );
          navigation.navigate("DiariasScreem", {
            fecha: fechaPendiente,
            semanales: true,
          });
        }
      } else {
        // Intentar obtener una fecha del comando
        const fecha = obtenerFechaDelComando(comando);

        if (fecha) {
          await speak.hablar(`Vamos al ${speak.formatearFechaVerbal(fecha)}`);
          navigation.navigate("DiariasScreem", {
            fecha: fecha,
            semanales: true,
          });
        } else {
          await speak.hablar("No entendí el día, intenta de nuevo");
        }
      }
    } catch (error) {
      await speak.hablar("No te he entendido");
    } finally {
      setIsListening(false);
      isProcessing.current = false;

      setTimeout(() => {
        voice.startWake(activarAsistente);
      }, 1000);
    }
  }, []);

  const cargarResumenDelMes = async (fechaString: string) => {
    setLoading(true);
    mes = fechaString.substring(0, 7);

    try {
      resumen = await api.getResumenMensual(student.id, mes);
      const nuevasMarcas: any = {};
      Object.keys(resumen).forEach((fecha) => {
        const info = resumen[fecha];
        nuevasMarcas[fecha] = {
          customStyles: {
            container: {
              backgroundColor: info.todas_hechas ? "#E8F5E9" : "#FFF3E0",
              borderRadius: 10,
              borderWidth: 2,
              borderColor: info.todas_hechas ? "#4CAF50" : "#FF8C42",
            },
            text: {
              color: "#000",
              fontWeight: "bold",
            },
          },
        };
      });
      setMarcas(nuevasMarcas);
    } catch (error) {
      console.error("Error al cargar resumen mensual:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const init = async () => {
        if (!user || !isMounted) return;

        // Detener cualquier escucha previa y limpiar callbacks viejos
        await voice.stopWake();

        // Esperar un bit antes de reactivar
        await new Promise((resolve) => setTimeout(resolve, 300));

        const hoy = new Date().toISOString().split("T")[0];
        await cargarResumenDelMes(hoy);

        if (!isMounted) return;

        if (student.asistenteVoz !== "none") {
          await speak.hablar(
            "Estás en el calendario. Elige un día para ver tus tareas.",
          );
        }
        if (student.asistenteVoz === "bidireccional") {
          await speak.hablar(
            'O di "VAMOS" para hacer la primera tarea que tienes pendiente',
          );
          // Registrar el callback AQUÍ en esta pantalla
          voice.startWake(() => {
            activarAsistente();
          });
        }
      };

      init();
    }, []),
  );

  const perfil = () => {
    navigation.navigate("PerfilScreen");
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#F5F5F5" }}>
      <Header
        uri={student.foto}
        nameBottom="PERFIL"
        navigation={perfil}
        nameHeader="LISTA.DE.TAREAS"
        uriPictograma="lista"
        arasaacService={false}
        style={scaleFont(25)}
      />

      <View
        style={[styles.content, styles.shadow, { padding: 10, marginTop: 20 }]}
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color="#FF8C42"
            style={{
              position: "absolute",
              zIndex: 1,
              alignSelf: "center",
              top: "50%",
            }}
          />
        )}

        <Calendar
          firstDay={1}
          markingType={"custom"}
          markedDates={marcas}
          onMonthChange={(month) => {
            cargarResumenDelMes(month.dateString);
            if (student.asistenteVoz !== "none") {
              speak.hablar(
                `Cambiando al mes de ${speak.getNombreMes(month.month)}`,
              );
            }
          }}
          theme={{
            textDayFontFamily: "escolar-bold",
            textMonthFontFamily: "escolar-bold",
            textDayHeaderFontFamily: "escolar-bold",
            todayTextColor: "#4C80D7",
            arrowColor: "#FF8C42",
            monthTextColor: "#2E4053",
            textDayFontSize: scaleFont(18),
            textMonthFontSize: scaleFont(22),
            calendarBackground: "transparent",
          }}
          onDayPress={(day) => {
            navigation.navigate("DiariasScreem", {
              fecha: day.dateString,
              semanales,
            });
          }}
          enableSwipeMonths={true}
        />
      </View>
    </SafeAreaProvider>
  );
}
