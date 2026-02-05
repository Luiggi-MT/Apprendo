import { StyleSheet } from "react-native";

export const tarjetaDescipcion_styles = StyleSheet.create({
  tarjet: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#FF8C42",
    borderRadius: 12,
    flexDirection: "row",    // Alineación horizontal
    alignItems: "center",    // Centrado vertical
    padding: 10,
    width: "100%",           // Asegura que no crezca más que el padre
    overflow: "hidden",      // Corta cualquier desbordamiento
    elevation: 3,            // Sombra en Android
    shadowColor: "#000",     // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  imageTarjet: {
    width: 70,
    height: 70,
    borderRadius: 10,        // Pictogramas suelen verse mejor con bordes suaves
    backgroundColor: "#F9F9F9",
  },

  superPuesto: {
    width: 70,
    height: 70,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageOverlay: {
    width: 70,
    height: 70,
    position: 'absolute',
    opacity: 0.7,
  },

  // ESTA ES LA CLAVE: El contenedor del nombre
  nameContainer: {
    flex: 1,                 // Toma todo el espacio disponible
    marginHorizontal: 12,    // Separa el texto de la imagen y del botón
  },

  // Contenedor del botón para que no se mueva
  descriptionContainer: {
    minWidth: 100,           // Evita que el botón se encoja demasiado
    alignItems: 'flex-end',
  }
});