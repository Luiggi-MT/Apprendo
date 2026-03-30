import { StyleSheet, Platform, Dimensions, PixelRatio } from "react-native";
import * as Device from "expo-device";
export const gradientColors = ["#4C80D7", "#42C9A6", "#FDD050"];


const isPhone = Device.deviceType === Device.DeviceType.PHONE;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Escala el tamaño de la fuente basándose en el ancho de pantalla
 * y aplica correcciones específicas para Android.
 */
export const scaleFont = (size) => {
  const baseWidth = 375; // iPhone 8 como estándar
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;

  // Obtenemos el factor de escalado de fuente del sistema (Accesibilidad)
  const fontScale = PixelRatio.getFontScale();

  // Aplicamos el cálculo base
  let finalSize = Math.round(newSize);

  // --- Ajustes específicos para Android ---
  if (Platform.OS === "android") {
    // Android suele renderizar fuentes ligeramente más grandes. 
    // Ajustamos para que se vea similar a iOS.
    finalSize = Math.round(newSize) - 1;

    // Controlamos que el ajuste de accesibilidad del sistema 
    // no deforme demasiado el diseño.
    if (fontScale > 1.2) {
      finalSize = finalSize * (1.2 / fontScale);
    }
  }

  // --- Límites de seguridad (Constraints) ---
  const minSize = size * 0.85;
  const maxSize = size * 1.15;

  if (finalSize < minSize) return Math.round(minSize);
  if (finalSize > maxSize) return Math.round(maxSize);

  return Math.round(finalSize);
};

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  android: {
    elevation: 10,
  },
  
});

export const styles = StyleSheet.create({

  //Contenedor principal
  container: {
    backgroundColor: "#E9E9E9",
    flex: 1,
  },


  //HEADER

  header: {
    height: Platform.OS === 'android' ? 140: 180,
    width: "100%",
    backgroundColor: "#2E4053",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    fontWeight: 'condensedBold',
  },

  bottomContainerHeder: {
    alignItems: "flex-start",
    marginLeft: 10,
    flex: 1,
  },

  titleHeaderContainer: {
    marginRight: 20,
  },

  titleHeaderText: {
    fontFamily: 'fredoka-bold',
    fontWeight: 'condensedBold',
    color: "white",
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  // Sombras
  shadow: {
    ...shadowStyle,
  },

  image: {
    padding: 2,
    width: 80,
    height: 80,
  },
  imageContraseña: {
    padding: 2,
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },

  //Botones
  legendBoton: {
    borderWidth: 0.5,
    borderColor: "white",
    backgroundColor: "#FF8C42",
    minWidth: 100,      
    paddingHorizontal: 10, 
    height: "auto",
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center", 
    alignItems: "center",
  },

  
  
  //Buscador

  buscador: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    fontSize: 20,
    fontFamily: 'escolar-bold',
    color: "#333",
    textAlign: "center",
  },

  content: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 10,
  },

  superPuesto: {
    width: 100,  
    height: 100,
    position: 'relative', 
  },

  imageBase: {
    width: 100,
    height: 100,
  },

  imageOverlay: {
    width: 100,       
    height: 100,
    position: 'absolute', 
    top: 0,         
    left: 0,
    opacity: 0.8,       
  },

  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 5,
  },
  // tipo de texto
  text:{
    fontFamily: 'escolar',
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  text_legend: {
    fontFamily: "escolar-bold",
    fontSize: 16,
    color: "#000",
  },

  textBoton: {
    fontSize: 13,
    fontFamily: "escolar-bold",
    color: "white",
    margin: 2,
  },

  name: {
    fontSize: scaleFont(16),
    fontFamily: "escolar-bold",

  },

  error: {
    color: "tomato",
    fontSize: scaleFont(12),
    fontFamily: "escolar-bold",
    textAlign: "center",
  },

  tituloExitoso: {
    fontFamily: 'escolar-bold', 
    fontSize: scaleFont(28),
    color: '#2E7D32',
    textAlign: 'center',
  },

  dropdownTextStyle: {
  fontFamily: 'escolar-bold', // O 'escolar-bold' según prefieras
  fontSize: scaleFont(16),
  },

  //Containers 
  descriptionContainer:{
    padding: 10, 
  },

  containerRefuerzoPositivo:{
    justifyContent: "center",
    alignItems: "center", 
  },

  radioButtonContainer:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  errorContainer: {
    backgroundColor: "#FFEBEE",
    marginTop: 15,
    padding: 8,
    borderRadius: 10,
  },



  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#FF0000",
  },

  overlayCross: {
    position: "absolute",
    width: 150, // Ajusta según el tamaño de tu tarjeta
    height: 150,
    top: 30, // Ajusta para centrar sobre la imagen
    opacity: 0.8,
  },
  overlayCross: {
    position: "absolute",
    width: 150, // Ajusta según el tamaño de tu tarjeta
    height: 150,
    top: 30, // Ajusta para centrar sobre la imagen
    opacity: 0.8,
  },

  // ... (tus estilos anteriores se mantienen igual)

  footerContainer: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: "#E9E9E9", 
    borderTopWidth: 0.5,
    borderTopColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTextMain: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: 'fredoka', 
    fontWeight: 'bold',
    color: '#333',
  },
  footerTextSub: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: 'escolar-bold',
    color: '#666',
    marginTop: 2,
  },
  footerLink: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'escolar-bold',
    color: '#4C80D7',
    textDecorationLine: 'underline',
  },
  

  botonDeshabilitado: {
    backgroundColor: "#CCCCCC", // Un gris claro
    opacity: 0.5,
  },
  textBotonDeshabilitado: {
    color: "#888888",
  },


  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,            // Bordes redondeados suaves
    marginVertical: 10,          // Separación entre tarjetas
    marginHorizontal: 5,
    padding: 15,
    flexDirection: "row",        // Alinea foto y texto horizontalmente
    alignItems: "center",        // Centra verticalmente el contenido
    
    // --- Sombras para iOS ---
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    // --- Sombra para Android ---
    elevation: 5,
    
    // El borde izquierdo se define dinámicamente en el componente 
    // según si está visitado o no, pero aquí damos el grosor base
    borderLeftWidth: 10, 
  },

  // Estilo para el contenedor de texto dentro de la card
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },

  // Estilo para la imagen del profesor
  profesorFoto: {
    width: 75,
    height: 75,
    borderRadius: 37.5, // Totalmente circular
    backgroundColor: "#F0F0F0",
    borderWidth: 2,
    borderColor: "#F5F5F5",
  },
  asistente: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: gradientColors[1],
  },
  buttonActive: {},
  buttonDissable: {},
  botonSumaResta: {
    padding: 5,
  },
  botonPrincipal: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  }, 
  vistaSelectorContainer: {
  flexDirection: "row",
  justifyContent: isPhone ? "flex-end" : "center",
  position: "absolute", // Para ponerlo abajo del header
  bottom: 10,           // Espacio desde la base del header
  width: "100%",
},

vistaSelectorButton: {
  paddingVertical: 10,
  paddingHorizontal: isPhone ? 12 : 25,
  marginHorizontal: isPhone ? 5 : 10,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: "white",
  backgroundColor: "transparent",
},

vistaSelectorButtonActive: {
  backgroundColor: "#4C80D7", // Resalta el botón activo
},

vistaSelectorText: {
  color: "white",
  fontSize: isPhone ? 14 : 18,
  fontFamily: "escolar-bold",
  textAlign: "center",
},

});
