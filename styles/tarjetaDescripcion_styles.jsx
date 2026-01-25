import { StyleSheet } from "react-native";

export const tarjetaDescipcion_styles = StyleSheet.create({
    tarjet: {
    marginBottom: 3,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageTarjet: {
    padding: 2,
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 50,
  },
  imageOverlay: {
  position: "absolute", // Se sale del flujo para flotar encima
  width: 80,            // Debe coincidir con el ancho de imageTarjet
  height: 80,           // Debe coincidir con el alto de imageTarjet
  opacity: 0.8,         // Un poco de transparencia para ver el fondo
  tintColor: "red",     // Opcional: fuerza el color rojo si el icono es negro
},
superPuesto: {
  position: "relative", // Necesario para que el 'absolute' de la cruz se oriente aquí
  width: 80,
  height: 80,
},
});