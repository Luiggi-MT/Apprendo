# 🚀 Guía Maestra de Despliegue: Expo, iOS, Android y Web

Este documento contiene la hoja de ruta completa para configurar, compilar, probar y publicar aplicaciones desarrolladas con **Expo (EAS)**.

---

## 1. Instalar EAS (Expo Application Services)

```bash
    npm install -g eas-cli
    eas login
```

## 2. Configurar el proyecto para producción

```bash
    eas build:configure
```

En https://expo.dev se puede visualizar las aplicaciones desarrolladas

### 🍎 IOS

Requisitos: Tener cuenta como desarrrollador de apple (Precio de 100 €) --> https://developer.apple.com/programs/

#### 1. Contruir la app para IOS

```bash
    eas build -p ios 
```

Expo genera el **.ipa**

Firmar la app

Usar cuenta de Apple Developer

#### 2. Crear la app en App Store Connect

https://appstoreconnect.apple.com
    My Apps → + → New App
    Rellena:
        &emsp; - Nombre
        &emsp; - Bundle ID
        &emsp; - Idioma
        &emsp; - SKU

#### 3. Subir la build de Apple

```bash
    eas submmit -p ios 
```

#### 4. Completar ficha de la App (MUY IMPORTANTE)

##### En App Store Connect

📸 Screenshots (obligatorios):
&emsp; - iPhone 6.7"
&emsp; - iPhone 6.1"

📝 Información:
&emsp; - Descripción
&emsp; - Palabras clave
&emsp; - Categoría
&emsp; - Email soporte
&emsp; - Política de privacidad (OBLIGATORIA si hay login)

#### 5. Revisión y publicación

##### Submit for Review

⏳ 1–3 días
Si todo está bien → 🎉 PUBLICADA

##### 🚨 Errores comunes Apple 

No declarar permisos (Camera, Microphone, etc.)
No tener política de privacidad
App incompleta o con fallos
Login sin usuario demo

### 🤖 Android

#### 1. Contruir la app para Android

```bash
    eas build -p android 
```

Expo genera el **.abb**

#### 2. Crear app en Google Play Store

https://play.google.com/console
    &emsp; - Create App
    &emsp; - Idioma, nombre, tipo
  
#### 3. Subir la build

Production → Create new release
Subir el **.aab**

#### 4. Fucha de la App

📝 Obligatorio:
    &emsp; - Descripción corta
    &emsp; - Descripción larga
    &emsp; - Icono 512x512
    &emsp; - Screenshots
    &emsp; - Categoría
    &emsp; - Email soporte
    &emsp; - Política de privacidad
  
#### 5. Cumplimentar formularios (MUY IMPORTANTE)

Google exige:
    &emsp; - Data Safety Form
    &emsp; - Target Audience
    &emsp; - Permissions
    &emsp; - Ads (sí/no)
    &emsp; - ⛔ Si fallas aquí, no publicas

#### 6. Revisión y publicación

⏳ 1–7 días
La primera app suele tardar más

---

## 🔁 ACTUALIZACIONES FUTURAS

### IOS

```bash
eas build -p ios
eas submit -p ios
```

Incrementar:

```bash
"buildNumber": "2"
```

### Android

```bash
eas build -p android
```

Incrementar:

```bash
"versionCode": 2
```

---

## 🧠. CONSEJOS PROFESIONALES

✅ Usa EAS Managed
✅ Sube primero Android (más rápido)
✅ Apple es más estricta
✅ Ten lista una política de privacidad real
✅ No publiques en viernes (revisiones más lentas)

---

## Pruebas en Andoid 🤖

### 📦 PASO 1: OBTENER EL .aab

Con Expo / EAS:

```bash
eas build -p android
```

Descarga el archivo:

```bash
app-release.aab
```

Guárdalo por ejemplo en:

```bash
~/bundletool/
```

### 📦 PASO 2: DESCARGAR bundletool

Si tienes:
**bundletool-all-1.18.2.jar**
Colócalo en la misma carpeta:

```bash
~/bundletool/
```

### 🔑 PASO 3: CREAR KEYSTORE (SOLO LA PRIMERA VEZ)

#### ⚠️ Necesario para firmar los APKs

```bash
keytool -genkeypair \
  -keystore debug.keystore \
  -alias androiddebugkey \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass android \
  -keypass android
```

📌 Usa estos datos (estándar Android)

Store password: android
Key password: android
Alias: androiddebugkey

#### 🧪 PASO 4: GENERAR .apks DESDE .aab

```bash
java -jar bundletool-all-1.18.2.jar build-apks \
  --bundle=application.aab \
  --output=app.apks \
  --mode=universal \
  --ks=debug.keystore \
  --ks-key-alias=androiddebugkey \
  --ks-pass=pass:android \
  --key-pass=pass:android
```

✔️ Esto crea:
**app.apks**
Desempaquetar el **.apks**

```bash
unzip app.apks
```

#### 📲 PASO 5: INSTALAR EN EL MÓVIL

Conecta el móvil y ejecuta:

```bash
java -jar bundletool-all-1.18.2.jar install-apks \
  --apks=app.apks
```

🎉 La app se instala exactamente como en Google Play

#### 🔍 PASO 6: VER APKs GENERADOS (opcional)

```bash
java -jar bundletool-all-1.18.2.jar extract-apks \
  --apks=app.apks \
  --output-dir=apks/
```

Verás:
**base.apk**

split APKs (abi, density, language)

#### 🧠 PROBLEMAS COMUNES

##### ❌ INSTALL_FAILED_UPDATE_INCOMPATIBLE

➡️ Desinstala la app antes:

```bash
adb uninstall com.luiggimt.app
```

##### ❌ Error de firma

➡️ Usa el mismo keystore siempre

##### ❌ No detecta el dispositivo

```bash
adb kill-server
adb start-server
```

---

## 🛜 WEB

### 1. Construir directorio dist 📁

```bash
npx expo export -p web
```

### 2. Mover la carpeta dist al directorio server

### 3. Subir todo el directorio server al servidor cloud

---

## Problemas de dependencias

Ejecutar:

```bash
npx expo install --fix
```
