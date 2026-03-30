import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ColorPickerProps {
  colors: readonly [string, string, ...string[]];
  initialColor?: string;
  onChange?: (color: string) => void;
}

const hslToHex = (h: number, s: number, l: number): string => {
  const sat = s / 100;
  const lig = l / 100;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lig - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const GRID_ROWS = 10;
const GRID_COLS = 12;
const CELL_SIZE = 24;
const GRID_SIZE = GRID_ROWS * GRID_COLS;

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  initialColor,
  onChange,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    initialColor && colors.includes(initialColor) ? initialColor : colors[0],
  );

  const paletteColors = useMemo(() => {
    const unique: string[] = [];
    const seen = new Set<string>();

    const addUnique = (value: string) => {
      const upper = value.toUpperCase();
      if (!seen.has(upper) && unique.length < GRID_SIZE) {
        seen.add(upper);
        unique.push(upper);
      }
    };

    for (let y = 0; y < GRID_ROWS && unique.length < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_COLS && unique.length < GRID_SIZE; x += 1) {
        // First column is pure grayscale from white to black.
        if (x === 0) {
          const lightness = Math.round(100 - (y / (GRID_ROWS - 1)) * 100);
          addUnique(hslToHex(0, 0, lightness));
          continue;
        }

        const hue = ((x - 1) / (GRID_COLS - 1)) * 360;
        const saturation = 100 - (y / (GRID_ROWS - 1)) * 50;
        const lightness = 92 - (y / (GRID_ROWS - 1)) * 70;

        let candidate = hslToHex(hue, saturation, lightness);

        if (seen.has(candidate)) {
          // Nudge hue/lightness to avoid repeated swatches.
          for (let i = 1; i <= 12; i += 1) {
            candidate = hslToHex(
              (hue + i * 7) % 360,
              saturation,
              Math.max(8, lightness - i),
            );
            if (!seen.has(candidate)) break;
          }
        }

        addUnique(candidate);
      }
    }

    // Ensure key anchor tones are present.
    addUnique("#000000");
    addUnique("#FFFFFF");
    colors.forEach(addUnique);

    // Safety fill: keep unique colors until grid is complete.
    for (let i = 0; unique.length < GRID_SIZE; i += 1) {
      addUnique(hslToHex((i * 19) % 360, 85, 50));
    }

    return unique;
  }, [colors]);

  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor);
    }
  }, [initialColor]);

  const selectColor = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {paletteColors.map((color, index) => (
          <TouchableOpacity
            key={`${color}-${index}`}
            onPress={() => selectColor(color)}
            style={[
              styles.gridCell,
              {
                backgroundColor: color,
                borderWidth:
                  selectedColor === color ? 2 : StyleSheet.hairlineWidth,
                borderColor: selectedColor === color ? "#111111" : "#D9D9D9",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignSelf: "center",
  },
  grid: {
    width: GRID_COLS * CELL_SIZE,
    height: GRID_ROWS * CELL_SIZE,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#B8BDC4",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#F1F3F5",
  },
  gridCell: {
    width: CELL_SIZE + 2,
    height: CELL_SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#C6CBD1",
  },
});

export default ColorPicker;
