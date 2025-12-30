import { Image, TouchableOpacity, Text, View } from "react-native";
import { Arasaac } from "../class/Arasaac/getPictograma";
import { styles } from "../styles/styles";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";
import { useEffect } from "react";

export default function Boton({
  uri,
  nameBottom,
  onPress,
  dissable = false,
  arasaacService = true,
  component = false,
}: {
  uri?: string;
  nameBottom?: string;
  onPress: () => void;
  dissable?: boolean;
  arasaacService?: boolean;
  component?: boolean;
}) {
  const ArasaacService = new Arasaac();
  const api = new ConnectApi();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={dissable}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      {component ? (
        <View style={styles.asistente}>
          <Image source={{ uri: api.getComponent(uri) }} style={styles.image} />
        </View>
      ) : arasaacService ? (
        uri && (
          <Image
            source={{ uri: ArasaacService.getPictograma(uri) }}
            style={styles.image}
          />
        )
      ) : (
        <Image source={{ uri: api.getFoto(uri) }} style={styles.image} />
      )}
      {nameBottom && nameBottom.length > 0 && (
        <View style={[styles.legendBoton, styles.shadow]}>
          <Text style={styles.textBoton}>{nameBottom}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
