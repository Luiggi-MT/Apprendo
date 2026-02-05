import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { styles } from "../styles/styles";
import { Arasaac } from "../class/Arasaac/getPictograma";
export default function None({
  description,
  uri,
}: {
  description: string;
  uri: string;
}) {
  const arassacService = new Arasaac();
  return (
    <View
      style={[
        styles.content,
        styles.shadow,
        { justifyContent: "center", alignItems: "center", flex: 1 },
      ]}
    >
      <Text style={styles.text}>{description}</Text>
      <View style={styles.superPuesto}>
        <ImageBackground
          source={{ uri: arassacService.getPictograma(uri) }}
          style={styles.imageBase}
        />
        <Image
          source={{ uri: arassacService.getPictograma("fallo") }}
          style={styles.imageOverlay}
        />
      </View>
    </View>
  );
}
