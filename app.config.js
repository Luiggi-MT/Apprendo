module.exports = {
  expo: {
    name: "Apprendo",
    slug: "apprendo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.luiggimt.apprendo",
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? "./GoogleService-Info.plist",
      buildNumber: "1",
      infoPlist: {
        NSCameraUsageDescription: "La cámara se usa para seleccionar imágenes de perfil",
        NSMicrophoneUsageDescription: "El micrófono se usa para funciones educativas",
        NSPhotoLibraryUsageDescription: "Acceso a la galería para seleccionar imágenes",
        NSSpeechRecognitionUsageDescription:
          "El micrófono se usa para el reconocimiento de voz para procesar comandos.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.luiggimt.apprendo",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.POST_NOTIFICATIONS",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-font",
      "expo-audio",
      "expo-video",
      "expo-secure-store",
      "expo-speech-recognition",
      [
        "expo-image-picker",
        {
          photosPermission: "Acceso a la galería para seleccionar imágenes",
          cameraPermission: "La cámara se usa para añadir fotos al material",
        },
      ],
      "expo-asset",
    ],
    extra: {
      eas: {
        projectId: "264d2b0b-7218-4796-b65d-a53c80ef6edb",
      },
    },
    owner: "luiggimt",
  },
};
