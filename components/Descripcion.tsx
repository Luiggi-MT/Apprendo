import { Image, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/styles";
import { tarjetaDescipcion_styles } from "../styles/tarjetaDescripcion_styles";
import { Arasaac } from "../class/Arasaac/getPictograma";

export default function Descripcion({
  uri = null,
  name,
  description,
  cantidad,
  selectedCantidadInicial = 0,
  onCantidadChange,
  navigation,
  tachado,
  style,
}: {
  uri?: string;
  name?: string;
  description?: string;
  cantidad?: number;
  selectedCantidadInicial?: number;
  onCantidadChange?: (cantidad: number) => void;
  navigation?: () => void;
  tachado?: boolean;
  style?: any;
}) {
  const [selectedCantidad, setSelectedCantidad] = useState(
    selectedCantidadInicial,
  );
  const arassacService = new Arasaac();
  const maxCantidad = cantidad ?? 0;
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopContinuousChange = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const applyDelta = (delta: number) => {
    setSelectedCantidad((prev) => {
      const next = Math.max(0, Math.min(maxCantidad, prev + delta));
      if (next === prev) {
        stopContinuousChange();
      }
      return next;
    });
  };

  const startContinuousChange = (delta: number) => {
    stopContinuousChange();
    applyDelta(delta);
    holdIntervalRef.current = setInterval(() => {
      applyDelta(delta);
    }, 120);
  };

  useEffect(() => {
    return () => {
      stopContinuousChange();
    };
  }, []);

  useEffect(() => {
    setSelectedCantidad(selectedCantidadInicial);
  }, [selectedCantidadInicial]);

  useEffect(() => {
    onCantidadChange?.(selectedCantidad);
  }, [selectedCantidad, onCantidadChange]);

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
          {name?.toUpperCase()}
        </Text>
        <Text style={[styles.text_legend, { fontSize: 12, color: "#666" }]}>
          {cantidad}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          disabled={selectedCantidad === 0}
          onPress={() => applyDelta(-1)}
          onLongPress={() => startContinuousChange(-1)}
          onPressOut={stopContinuousChange}
          delayLongPress={180}
        >
          <Ionicons
            name="remove-circle"
            size={45}
            color={selectedCantidad === 0 ? "#D8D8D8" : "#FF8C42"}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            minWidth: 60,
            textAlign: "center",
            color: "#FF8C42",
          }}
        >
          {selectedCantidad}
        </Text>
        <TouchableOpacity
          disabled={selectedCantidad >= maxCantidad}
          onPress={() => applyDelta(1)}
          onLongPress={() => startContinuousChange(1)}
          onPressOut={stopContinuousChange}
          delayLongPress={180}
        >
          <Ionicons
            name="add-circle"
            size={45}
            color={selectedCantidad >= maxCantidad ? "#D8D8D8" : "#FF8C42"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
