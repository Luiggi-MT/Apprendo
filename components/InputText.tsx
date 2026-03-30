import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "../styles/styles";
export default function InputText({
  nameInput,
  input,
  secure = false,
  value,
  placehorder,
  editable = true,
  autoCapitalize = "characters",
}: {
  nameInput?: string;
  input: (inputText: string) => void;
  secure?: boolean;
  value: string;
  placehorder?: string;
  editable?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const [text, setText] = useState("");
  const handleTextChange = (inputText: string) => {
    setText(inputText);
    input(inputText);
  };
  return (
    <View>
      <Text style={styles.text_legend}>{nameInput}</Text>
      <TextInput
        style={[styles.buscador, styles.shadow, { textAlign: "left" }]}
        onChangeText={handleTextChange}
        value={value}
        secureTextEntry={secure}
        placeholder={placehorder}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}
