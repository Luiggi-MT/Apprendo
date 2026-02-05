import { Image, Text, View } from "react-native";
import Boton from "./Boton";
import { styles } from "../styles/styles";
import { tarjetaDescipcion_styles } from "../styles/tarjetaDescripcion_styles";
import { Arasaac } from "../class/Arasaac/getPictograma";
import { useEffect } from "react";

export default function TarjetaDescipcion({
  uri = null,
  name,
  description,
  navigation,
  tachado,
  style,
}: {
  uri?: string;
  name?: string;
  description?: string;
  navigation?: () => void;
  tachado?: boolean;
  style?: any;
}) {
  const arassacService = new Arasaac();

  return (
    <View style={tarjetaDescipcion_styles.tarjet}>
      {uri !== null && (
        <View style={tarjetaDescipcion_styles.superPuesto}>
          <Image
            source={{ uri: uri }}
            style={tarjetaDescipcion_styles.imageTarjet}
          />
          {tachado === true && (
            <Image
              source={{ uri: arassacService.getPictograma("fallo") }}
              style={tarjetaDescipcion_styles.imageOverlay}
            />
          )}
        </View>
      )}

      <View style={tarjetaDescipcion_styles.nameContainer}>
        <Text numberOfLines={2} style={[styles.text_legend, style]}>
          {name}
        </Text>
      </View>

      <View style={tarjetaDescipcion_styles.descriptionContainer}>
        <Boton nameBottom={description} onPress={navigation} />
      </View>
    </View>
  );
}
