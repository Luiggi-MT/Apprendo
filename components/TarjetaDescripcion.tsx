import { Image, Text, View } from "react-native";
import Boton from "./Boton";
import { styles } from "../styles/styles";
import { tarjetaDescipcion_styles } from "../styles/tarjetaDescripcion_styles";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function TarjetaDescipcion({
  uri,
  name,
  description,
  navigation,
  tachado,
  style,
}: {
  uri: string;
  name: string;
  description: string;
  tachado?: boolean;
  style?: object;
  navigation: () => void;
}) {
  const arassacService = new Arasaac();

  return (
    <View style={tarjetaDescipcion_styles.tarjet}>
      {tachado ? (
        <View style={tarjetaDescipcion_styles.superPuesto}>
          <Image
            source={{ uri: uri }}
            style={tarjetaDescipcion_styles.imageTarjet}
          />
          <Image
            source={{ uri: arassacService.getPictograma("fallo") }}
            style={tarjetaDescipcion_styles.imageOverlay}
          />
        </View>
      ) : (
        <Image
          style={[tarjetaDescipcion_styles.imageTarjet]}
          source={{ uri: uri }}
        />
      )}

      <Text style={[styles.text_legend, style]}>{name}</Text>
      <View style={styles.descriptionContainer}>
        <Boton nameBottom={description} onPress={navigation} />
      </View>
    </View>
  );
}
