import React from "react";
import { Arasaac } from "../class/Arasaac/getPictograma";
import { Image, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
export default function BotonContraseña({
  uri,
  onPress,
}: {
  uri: string;
  onPress: () => void;
}) {
  const ArasaacService = new Arasaac();
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{ uri: ArasaacService.getPictograma(uri) }}
        style={styles.imageContraseña}
      />
    </TouchableOpacity>
  );
}
