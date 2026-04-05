import React, { useState } from "react";
import { TextInput, View, Image } from "react-native";
import { styles } from "../styles/styles";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function Buscador({
  nameBuscador,
  onPress,
}: {
  nameBuscador: string;
  onPress: (searchText: string) => void;
}) {
  const [text, onChangeText] = useState("");
  const handleTextChange = (input: string) => {
    onChangeText(input);
    onPress(input);
  };
  const api = new Arasaac();
  return (
    <View>
      <TextInput
        style={[styles.buscador, styles.shadow]}
        onChangeText={handleTextChange}
        value={text}
        placeholder={nameBuscador}
        placeholderTextColor="#999"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <Image
        source={{ uri: api.getPictograma("buscador") }}
        style={{
          width: 30,
          height: 30,
          position: "absolute",
          right: 20,
          top: 15,
          marginTop: 3,
        }}
      />
    </View>
  );
}
