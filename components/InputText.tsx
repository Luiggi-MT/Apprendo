import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "../styles/styles";
export default function InputText({
  nameInput,
  input,
  secure = false,
  value,
  placehorder,
}: {
  nameInput?: string;
  input: (inputText: string) => void;
  secure?: boolean;
  value: string;
  placehorder?: string;
}) {
  const [text, setText] = useState("");
  const handleTextChange = (inputText: string) => {
    setText(inputText);
    input(inputText);
  };
  return (
    <View>
      <Text>{nameInput}</Text>
      <TextInput
        style={[styles.buscador, styles.shadow, {}]}
        onChangeText={handleTextChange}
        value={value}
        secureTextEntry={secure}
        placeholder={placehorder}
      />
    </View>
  );
}
