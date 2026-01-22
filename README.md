
# 📱 Cole App - Frontend (Mobile)

Este es el cliente móvil del proyecto **Cole**, una plataforma educativa inclusiva. La aplicación está diseñada para facilitar la interacción de los estudiantes mediante múltiples métodos de autenticación y herramientas de accesibilidad.

## 🚀 Funcionalidades Principales

* **Autenticación Flexible**: Soporte para login tradicional (usuario/contraseña) y login basado en imágenes para estudiantes.
* **Accesibilidad Avanzada**: Integración con lectores de pantalla y preferencias visuales personalizadas.
* **Speech-to-Text**: Utiliza **OpenAI Whisper** para la transcripción de voz en tareas específicas.
* **Gestión de Sesiones**: Persistencia de datos de usuario y estados de conexión.
* **Perfil Personalizado**: Visualización y actualización de fotos de perfil y preferencias.

## 🛠️ Tecnologías

* **Framework**: [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/).
* **Navegación**: React Navigation (Stack & Tabs).
* **Comunicación**: fetch para peticiones al servidor Flask.
* **Estado Global**: React Context API.
* **Estilos**: StyleSheet (Native) y soporte para temas claro/oscuro.

## 📦 Instalación de dependencias

```bash
npm install
```

## Ejecicion

```bash
expo start
```

## 📂 Estructura de Carpetas

```bash
├── src/
│   ├── components/     # Componentes atómicos reutilizables
│   ├── screens/        # Pantallas completas (Login, Perfil, Home)
│   ├── navigation/     # Configuración de rutas y menús
│   ├── context/        # Lógica de autenticación y estado global
│   ├── services/       # Clientes de API (Axios)
│   └── utils/          # Funciones de ayuda y constantes
├── assets/             # Recursos estáticos (imágenes, fuentes)
└── App.js              # Punto de entrada principal

```

## 🧪 Testing

```bash
npm test
```
