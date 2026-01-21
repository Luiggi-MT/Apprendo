import { Text, View, FlatList, Image } from "react-native";
import { scaleFont, styles } from "../styles/styles";
import Header from "../components/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Boton from "../components/Boton";
import { useEffect, useState } from "react";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { Students } from "../class/Interface/Students";
import Buscador from "../components/Buscador";
import BotonPerfil from "../components/BotonPerfil";
import { homeScreem_styles } from "../styles/homeScreem_styles";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const api = new ConnectApi();
  const arassacService = new Arasaac();
  const [students, setStudents] = useState<Students[]>([]);
  const [offset, setOffset] = useState(0);
  const [busqueda, setBusqueda] = useState(false);
  const [message, setMessage] = useState("");
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    api.getStudents().then((data) => {
      setStudents(data.students || []);
      setOffset(data.offset);
      setLimit(data.count);
    });
  }, []);

  const handleBuscadorPress = (searchText: string) => {
    if (searchText.length === 0) {
      setBusqueda(false);
      api.getStudents().then((data) => {
        setStudents(data.students || []);
        setOffset(data.offset);
        setLimit(data.count);
      });
    } else {
      api.getEstudentByName(searchText).then((data) => {
        setBusqueda(true);
        if (data.students || []) {
          setStudents(data.students || []);
          setOffset(data.offset);
          setLimit(data.count);
          setMessage(searchText);
        } else {
          setStudents([]);
          setOffset(0);
          setLimit(0);
        }
      });
    }
  };
  const handleSiguentePress = () => {
    if (busqueda) {
      api.getEstudentByName(message, offset).then((data) => {
        setStudents(data.students);
        setOffset(data.offset);
        setLimit(data.count);
      });
    } else {
      api.getStudents(offset).then((data) => {
        setStudents(data.students);
        setOffset(data.offset);
        setLimit(data.count);
      });
    }
  };
  const handleAtrasPress = () => {
    if (busqueda) {
      api
        .getEstudentByName(message, offset - 2 * api.getLimit())
        .then((data) => {
          setStudents(data.students);
          setOffset(data.offset);
          setLimit(data.count);
        });
    } else {
      api.getStudents(offset - 2 * api.getLimit()).then((data) => {
        setStudents(data.students);
        setOffset(data.offset);
        setLimit(data.count);
      });
    }
  };
  const onProfesoradoPress = () => {
    navigation.push("Profesorado");
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        uri="profesor"
        nameBottom="PROFESORADO"
        navigation={() => onProfesoradoPress()}
        nameHeader="PROYECTA"
        style={scaleFont(36)}
      />
      <View>
        <Buscador
          nameBuscador="BUSCAR ESTUDIANTE"
          onPress={handleBuscadorPress}
        />
      </View>
      {students.length === 0 ? (
        <View
          style={[
            styles.content,
            styles.shadow,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.text}>NO SE HAN ENCONTRADO ESTUDIANTES</Text>
          <View style={styles.superPuesto}>
            <Image
              source={{ uri: arassacService.getPictograma("estudiante") }}
              style={styles.imageBase}
            />
            <Image
              source={{ uri: arassacService.getPictograma("fallo") }}
              style={styles.imageOverlay}
            />
          </View>
        </View>
      ) : (
        <View style={[styles.content, styles.shadow]}>
          <FlatList
            data={students}
            numColumns={3}
            renderItem={({ item }) => (
              <BotonPerfil item={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={homeScreem_styles.columnWrapper}
            ListEmptyComponent={
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.text}>NO HAY ESTUDIANTES DISPONIBLES</Text>
                <View style={styles.superPuesto}>
                  <Image
                    source={{ uri: arassacService.getPictograma("estudiante") }}
                    style={styles.imageBase}
                  />
                  <Image
                    source={{ uri: arassacService.getPictograma("fallo") }}
                    style={styles.imageOverlay}
                  />
                </View>
              </View>
            }
            scrollEnabled={false}
          />
          <View style={styles.navigationButtons}>
            <Boton
              uri="atras"
              onPress={handleAtrasPress}
              dissable={offset <= 0}
            />
            <Boton
              uri="delante"
              onPress={handleSiguentePress}
              dissable={offset >= limit}
            />
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
}
