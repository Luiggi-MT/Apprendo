import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";

import Header from "../../components/Header";
import Boton from "../../components/Boton";
import { Students } from "../../class/Interface/Students";
import { UserContext } from "../../class/context/UserContext";
import { scaleFont, styles } from "../../styles/styles";
import { ConnectApi } from "../../class/Connect.Api/ConnectApi";
import { Speak } from "../../class/Speak/Speak";

export default function MensualScreen({ navigation }: { navigation: any }) {
  const { user } = useContext(UserContext);
  const student = user as Students;

  const [marcas, setMarcas] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const api = new ConnectApi();
  //const speak = new Speak();
  const semanales: boolean = true;

  const cargarResumenDelMes = async (fechaString: string) => {
    setLoading(true);
    const mes = fechaString.substring(0, 7);

    try {
      const resumen = await api.getResumenMensual(student.id, mes);
      const nuevasMarcas: any = {};

      Object.keys(resumen).forEach((fecha) => {
        const info = resumen[fecha];
        nuevasMarcas[fecha] = {
          customStyles: {
            container: {
              backgroundColor: info.todas_hechas ? "#E8F5E9" : "#FFF3E0", // Verde suave / Naranja suave
              borderRadius: 10,
              borderWidth: 2,
              borderColor: info.todas_hechas ? "#4CAF50" : "#FF8C42", // Verde fuerte / Naranja fuerte
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

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    cargarResumenDelMes(hoy);

    if (student.asistenteVoz !== "none") {
      //speak.hablar("Estás en el calendario. Elige un día para ver tus tareas.");
    }
  }, []);

  const perfil = () => {
    //speak.detenerAsistente();
    navigation.navigate("PerfilScreen");
  };

  const activarAsistente = async () => {
    /*
    speak.hablar("Te escucho", async () => {
      const comando = await speak.procesarComandoVoz();
      if (
        comando?.toLowerCase().includes("atrás") ||
        comando?.toLowerCase().includes("volver")
      ) {
        navigation.goBack();
      } else {
        speak.hablar("Dime 'volver' para ir a la pantalla anterior");
      }
    });*/
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
              //speak.hablar(`Cambiando al mes de ${month.month}`);
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

      {student.asistenteVoz === "bidireccional" && (
        <View style={{ marginBottom: 20 }}>
          <Boton component={true} uri="Cohete.png" onPress={activarAsistente} />
        </View>
      )}
    </SafeAreaProvider>
  );
}
