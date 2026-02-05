import React from "react";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { scaleFont, styles } from "../styles/styles";
export default function Splash({ name }: { name: string }) {
  return (
    <View style={[styles.content, styles.shadow]}>
      <ActivityIndicator size="large" color="#FF8C42" />
      <Text
        style={[
          styles.text_legend,
          {
            textAlign: "center",
            marginTop: 20,
            fontSize: scaleFont(18),
            fontWeight: "bold",
            color: "#333",
          },
        ]}
      >
        {name.toUpperCase()}...
      </Text>
      <Text
        style={[
          styles.text,
          { fontSize: scaleFont(15), marginTop: 10, color: "#666" },
        ]}
      >
        POR FAVOR, ESPERE UN MOMENTO.
      </Text>
    </View>
  );
}
