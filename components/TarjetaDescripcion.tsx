import { Image, Text, View } from "react-native";
import Boton from "./Boton";
import { styles } from "../styles/styles";
import { tarjetaDescipcion_styles } from "../styles/tarjetaDescripcion_styles";

export default function TarjetaDescipcion({
  uri,
  name,
  description,
  navigation,
}: {
  uri: string;
  name: string;
  description: string;
  navigation: () => void;
}) {
  return (
    <View style={tarjetaDescipcion_styles.tarjet}>
      <Image
        style={[tarjetaDescipcion_styles.imageTarjet]}
        source={{ uri: uri }}
      />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.descriptionContainer}>
        <Boton nameBottom={description} onPress={navigation} />
      </View>
    </View>
  );
}
