import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Boton from "./Boton";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/styles";
import { Arasaac } from "../class/Arasaac/getPictograma";
import * as Device from "expo-device";

export default function Header({
  uri,
  uriPictograma,
  nameBottom,
  navigation,
  nameHeader,
  arasaacService = true,
  style,
  profesor,
  uriApi = false,
  uriFoto,
  vistaSelector = null,
}: {
  uri: string;
  uriPictograma?: string;
  nameBottom: string;
  navigation: () => void;
  nameHeader: string;
  arasaacService?: boolean;
  style?: number;
  profesor?: string;
  uriApi?: boolean;
  uriFoto?: string;
  vistaSelector?: {
    vista: "menu" | "postre";
    setVista: (v: "menu" | "postre") => void;
  };
}) {
  const ArasaacService = new Arasaac();
  const headerText: string[] = nameHeader.split(".");
  const isPhone = Device.deviceType === Device.DeviceType.PHONE;
  const hideHeaderMeta = isPhone && !!vistaSelector;

  return (
    <SafeAreaView style={styles.header}>
      {/* Botón de volver */}
      <View style={styles.bottomContainerHeder}>
        <Boton
          uri={uri}
          nameBottom={nameBottom}
          onPress={navigation}
          dissable={false}
          arasaacService={arasaacService}
        />
      </View>

      {/* Título */}
      {!hideHeaderMeta && (
        <View style={styles.titleHeaderContainer}>
          {headerText.map((text) => (
            <Text
              key={text}
              style={[styles.titleHeaderText, { fontSize: style }]}
            >
              {text}
            </Text>
          ))}
        </View>
      )}

      {/* Selector MENÚ / POSTRES centrado abajo */}
      {isPhone && vistaSelector && (
        <View style={styles.vistaSelectorContainer} pointerEvents="box-none">
          {["menu", "postre"].map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => vistaSelector.setVista(v as "menu" | "postre")}
              style={[
                styles.vistaSelectorButton,
                vistaSelector.vista === v && styles.vistaSelectorButtonActive,
              ]}
            >
              <Image
                source={{
                  uri: ArasaacService.getPictograma(
                    v === "menu" ? "comida" : "postre",
                  ),
                }}
                style={styles.image}
              />
              <Text style={styles.vistaSelectorText}>{v.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {!isPhone && vistaSelector && (
        <View style={styles.vistaSelectorContainer} pointerEvents="box-none">
          {["menu", "postre"].map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => vistaSelector.setVista(v as "menu" | "postre")}
              style={[
                styles.vistaSelectorButton,
                vistaSelector.vista === v && styles.vistaSelectorButtonActive,
              ]}
            >
              <Image
                source={{
                  uri: ArasaacService.getPictograma(
                    v === "menu" ? "comida" : "postre",
                  ),
                }}
                style={styles.image}
              />
              <Text style={styles.vistaSelectorText}>{v.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Pictograma o foto */}

      {!hideHeaderMeta && uriPictograma && (
        <Image
          source={{ uri: ArasaacService.getPictograma(uriPictograma) }}
          style={{ width: 90, height: 90, alignSelf: "center", marginTop: 5 }}
        />
      )}
      {!hideHeaderMeta && uriApi && uriFoto && (
        <View style={{ alignItems: "center", marginTop: 5 }}>
          <Image source={{ uri: uriFoto }} style={{ width: 90, height: 90 }} />
          <Text
            style={[
              styles.text_legend,
              { color: "white", fontSize: 17, textAlign: "center" },
            ]}
          >
            {profesor.toUpperCase()}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
