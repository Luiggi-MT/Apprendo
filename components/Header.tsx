import React from "react";
import { View, Image, Text } from "react-native";
import Boton from "./Boton";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/styles";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function Header({
  uri,
  uriPictograma,
  nameBottom,
  navigation,
  nameHeader,
  arasaacService = true,
  style,
}: {
  uri: string;
  uriPictograma?: string;
  nameBottom: string;
  navigation: () => void;
  nameHeader: string;
  arasaacService?: boolean;
  style?: any;
}) {
  const ArasaacService = new Arasaac();
  const headerText: string[] = nameHeader.split(".");

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.bottomContainerHeder}>
        <Boton
          uri={uri}
          nameBottom={nameBottom}
          onPress={navigation}
          dissable={false}
          arasaacService={arasaacService}
        />
      </View>

      <View style={styles.titleHeaderContainer}>
        {headerText.map((text) => (
          <Text
            key={text}
            style={[styles.titleHeaderText, styles.shadow, { fontSize: style }]}
          >
            {text}
          </Text>
        ))}
      </View>
      {uriPictograma && (
        <Image
          source={{ uri: ArasaacService.getPictograma(uriPictograma) }}
          style={{ width: 90, height: 90 }}
        />
      )}
    </SafeAreaView>
  );
}
