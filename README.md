# Cole App Frontend (Mobile)

Cliente movil del proyecto Cole, orientado a una experiencia educativa inclusiva para alumnado y profesorado.

## Funcionalidades principales

- Autenticacion para estudiantes y profesorado.
- Soporte de accesibilidad con asistente de voz y preferencias de visualizacion.
- Gestion de sesiones y perfil de usuario.
- Flujos de tareas diarias y mensuales.
- Integracion de notificaciones push con Firebase.

## Stack tecnico

- React Native con Expo (SDK 54).
- Navegacion con React Navigation.
- API HTTP con fetch hacia backend Flask.
- Estado global con Context API.
- Almacenamiento seguro con expo-secure-store.
- Voz y multimedia con modulos Expo.

## Requisitos

- Node.js 20 LTS recomendado.
- npm.
- Android Studio (si ejecutas Android nativo).
- Xcode (si ejecutas iOS en macOS).

## Instalacion

```bash
npm install
```

## Ejecucion

Desarrollo con Expo:

```bash
npm run start
```

Android:

```bash
npm run android
```

iOS:

```bash
npm run ios
```

Web:

```bash
npm run web
```

## Estructura de carpetas (resumen)

```text
app/
├── App.js
├── index.js
├── assets/
├── components/
├── Views/
├── class/
├── styles/
├── android/
├── ios/
└── package.json
```

## Testing

```bash
npm test
```

## Notas de configuracion

- El proyecto usa archivos de configuracion de Firebase en local para Android/iOS.
- Esos archivos deben estar en .gitignore y no subirse al repositorio.

## Creditos y licencia de recursos

Este proyecto utiliza pictogramas de ARASAAC.

- Fuente: <https://arasaac.org>
- El uso de pictogramas y recursos graficos debe respetar las condiciones y atribucion indicadas por ARASAAC.

## Licencia del proyecto

Revisar el archivo LICENSE para conocer las condiciones de uso publicadas para este repositorio.
