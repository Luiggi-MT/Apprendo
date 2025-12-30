import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";

const api = new ConnectApi();

export default function BotonPerfil({
  item,
  navigation,
}: {
  item: any;
  navigation: any;
}) {
  const Login = (student) => {
    console.log(student);
    if (student.tipoContraseña === "alfanumerica")
      navigation.navigate("LoginAlumnoAlfanumerica", { student: student });
    if (student.tipoContraseña === "imagenes")
      navigation.navigate("LoginAlumnoImagenes", { student: student });
    if (student.tipoContraseña === "pin")
      navigation.navigate("LoginAlumnoPin", { student: student });
  };
  return (
    <TouchableOpacity style={styles.studentItem} onPress={() => Login(item)}>
      <Image
        source={{ uri: api.getFoto(item.foto) }}
        style={[{ width: 100, height: 100 }, styles.studentCard]}
      />
      <Text style={styles.studentCardUsername}>{item.username}</Text>
    </TouchableOpacity>
  );
}
