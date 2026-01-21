import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { homeScreem_styles } from "../styles/homeScreem_styles";

const api = new ConnectApi();

export default function BotonPerfil({
  item,
  navigation,
}: {
  item: any;
  navigation: any;
}) {
  const Login = (student) => {
    if (student.tipoContraseña === "alfanumerica")
      navigation.navigate("LoginAlumnoAlfanumerica", { student: student });
    if (student.tipoContraseña === "imagenes")
      navigation.navigate("LoginAlumnoImagenes", { student: student });
    if (student.tipoContraseña === "pin")
      navigation.navigate("LoginAlumnoPin", { student: student });
  };
  return (
    <TouchableOpacity
      style={homeScreem_styles.studentItem}
      onPress={() => Login(item)}
    >
      <Image
        source={{ uri: api.getFoto(item.foto) }}
        style={[homeScreem_styles.studentCard]}
      />
      <Text style={[homeScreem_styles.studentCardUsername]}>
        {item.username.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}
