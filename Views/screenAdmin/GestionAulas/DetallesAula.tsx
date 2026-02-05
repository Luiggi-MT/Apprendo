import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Header from "../../../components/Header";
import { scaleFont, styles } from "../../../styles/styles";
import { ConnectApi } from "../../../class/Connect.Api/ConnectApi";
import { Aula } from "../../../class/Interface/Aula";
import { Profesor } from "../../../class/Interface/Profesor";
import Boton from "../../../components/Boton";
import Splash from "../../../components/Splash";

export default function DetallesAula({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { aulaId } = route.params;
  const [aula, setAula] = useState<Aula>(null);
  const [profesor, setProfesor] = useState<Profesor>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [desvincular, setDesvincular] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<string>("");
  const [deleteAula, setDeleteAula] = useState(false);

  const api = new ConnectApi();

  const handleDesactivarAulaPress = async () => {
    setError(false);
    setDesvincular(true);
    setErrorValue("");
    const response = await api.desasignarProfesorAula(profesor.id, aulaId);
    if (!response) {
      setDesvincular(false);
      setError(true);
      setErrorValue("NO SE HA PODIDO DESVINCULAR AL PROFESOR DEL AULA");
      return;
    }
    setTimeout(() => {
      setDesvincular(false);
      navigation.goBack();
    }, 2000);
  };
  const handleAsignarProfesorPress = () => {
    navigation.replace("AsignarProfesorAula", { aulaId: aulaId });
  };
  const handleBorrarPress = async () => {
    setDeleteAula(true);
    setErrorValue("");
    setError(false);
    const response = await api.deletaAula(aulaId);
    if (!response) {
      setDeleteAula(false);
      setError(true);
      setErrorValue("NO SE HA PODIDO ELIMINAR EL AULA");
      return;
    }

    setTimeout(() => {
      setDeleteAula(false);
      navigation.goBack();
    }, 2000);
  };
  const atras = () => navigation.goBack();
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const aulaResponse = await api.getAulaById(aulaId);

      setAula(aulaResponse);

      if (aulaResponse.id_profesor) {
        const resProfe: Profesor = await api.getProfesorById(
          aulaResponse.id_profesor,
        );
        setProfesor(resProfe);
      }
    } catch (error) {
      console.error("Error cargando detalles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [aulaId]);

  return (
    <SafeAreaProvider>
      <Header
        uri="volver"
        nameBottom="ATRÁS"
        navigation={atras}
        nameHeader="DETALLES.AULA"
        uriPictograma="aula"
        style={scaleFont(30)}
      />
      {desvincular ? (
        <Splash name="DESVINCULANDO EL PROFESOR AL AULA" />
      ) : (
        <View>
          {loading ? (
            <Splash name="CARGANDO DATOS" />
          ) : deleteAula ? (
            <Splash name="ELIMINAR AULA" />
          ) : (
            <View
              style={[
                styles.content,
                styles.shadow,
                { alignItems: "center", padding: 20 },
              ]}
            >
              <View style={{ marginBottom: 30, alignItems: "center" }}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: scaleFont(32), fontWeight: "bold" },
                  ]}
                >
                  {aula?.nombre}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#DDD",
                  marginBottom: 30,
                }}
              />

              <Text
                style={[
                  styles.text,
                  { fontSize: scaleFont(18), marginBottom: 15 },
                ]}
              >
                PROFESOR RESPONSABLE:
              </Text>

              {profesor ? (
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#F5F5F5",
                    borderRadius: 20,
                    padding: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                  }}
                >
                  <Image
                    source={{ uri: api.getFoto(profesor.foto) }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: "#DDD",
                    }}
                  />
                  <View style={{ marginLeft: 20 }}>
                    <Text
                      style={[
                        styles.text,
                        { fontSize: scaleFont(22), fontWeight: "600" },
                      ]}
                    >
                      {profesor.username.toUpperCase()}
                    </Text>
                    <Text
                      style={{
                        fontSize: scaleFont(14),
                        color: "#666",
                        marginTop: 5,
                      }}
                    >
                      ID PROFESOR: {profesor.id}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#E3F2FD",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 10,
                        marginTop: 8,
                        alignSelf: "flex-start",
                      }}
                    >
                      <TouchableOpacity onPress={handleDesactivarAulaPress}>
                        <Text
                          style={[
                            styles.text_legend,
                            {
                              color: "#1976D2",
                              fontWeight: "bold",
                              fontSize: 12,
                            },
                          ]}
                        >
                          ASIGNADO
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#F5F5F5",
                    borderRadius: 20,
                    padding: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                  }}
                >
                  <Image
                    source={{ uri: "" }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: "#DDD",
                    }}
                  />
                  <View style={{ marginLeft: 20 }}>
                    <Text
                      style={[
                        styles.text,
                        { fontSize: scaleFont(22), fontWeight: "600" },
                      ]}
                    >
                      {" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: scaleFont(14),
                        color: "#666",
                        marginTop: 5,
                      }}
                    >
                      ID PROFESOR:{" "}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#FFEBEE",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 10,
                        marginTop: 8,
                        alignSelf: "flex-start",
                      }}
                    >
                      <TouchableOpacity onPress={handleAsignarProfesorPress}>
                        <Text
                          style={[
                            styles.text_legend,
                            {
                              color: "#D32F2F",
                              fontWeight: "bold",
                              fontSize: 12,
                            },
                          ]}
                        >
                          ASIGNAR PROFESOR
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {error && (
            <View>
              <Text style={[styles.error]}>{errorValue}</Text>
            </View>
          )}
          <View>
            <Boton
              nameBottom="BORRAR"
              uri="borrar"
              onPress={handleBorrarPress}
            />
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
}
