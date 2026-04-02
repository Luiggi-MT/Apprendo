import { Image, TouchableOpacity, Text, View } from "react-native";
import { Arasaac } from "../class/Arasaac/getPictograma";
import { styles } from "../styles/styles";
import { ConnectApi } from "../class/Connect.Api/ConnectApi";

export default function Boton({
  uri,
  nameBottom,
  onPress,
  dissable = false,
  arasaacService = true,
  component = false,
  arasaacServiceID = false,
}: {
  uri?: any;
  nameBottom?: string;
  onPress?: () => void;
  dissable?: boolean;
  arasaacService?: boolean;
  component?: boolean;
  arasaacServiceID?: boolean;
}) {
  const ArasaacService = new Arasaac();
  const api = new ConnectApi();
  const texts = typeof nameBottom === "string" ? nameBottom.split(".") : [];

  const opacityStyle = dissable ? { opacity: 0.4 } : { opacity: 1 };
  const grayscaleStyle = dissable ? { tintColor: "gray" } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={dissable}
      style={[{ justifyContent: "center", alignItems: "center" }, opacityStyle]}
    >
      {component ? (
        <View style={styles.asistente}>
          <Image source={{ uri: api.getComponent(uri) }} style={styles.image} />
        </View>
      ) : arasaacService ? (
        uri &&
        (arasaacServiceID ? (
          <Image
            source={{ uri: ArasaacService.getPictogramaId(uri) }}
            style={styles.image}
          />
        ) : (
          <Image
            source={{ uri: ArasaacService.getPictograma(uri) }}
            style={styles.image}
          />
        ))
      ) : (
        <Image source={{ uri: api.getFoto(uri) }} style={styles.image} />
      )}

      {nameBottom && nameBottom.length > 0 && (
        <View
          style={[
            styles.legendBoton,
            styles.shadow,
            dissable && { backgroundColor: "#A9A9A9", borderColor: "#888" },
          ]}
        >
          {texts.map((text, it) => (
            <Text key={it} style={styles.textBoton}>
              {text}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
