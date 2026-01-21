import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConnectApi } from "./class/Connect.Api/ConnectApi";
import { UserContext } from "./class/context/UserContext";
import { PaperProvider } from "react-native-paper";
import { LocaleConfig } from "react-native-calendars";

import * as SplashScreen from 'expo-splash-screen'

import HomeScreen from "./Views/HomeScreen";

import Profesorado from "./Views/Profesorado";
import LoginAlumnoAlfanumerica from "./Views/loginAlumnos/LoginAlumnoAlfanumerica";
import LoginAlumnoImagenes from "./Views/loginAlumnos/LoginAlumnoImagenes";
import LoginAlumnoPin from "./Views/loginAlumnos/LoginAlumnoPin";

import AdminScreen from "./Views/homeProfesorado/AdminScreen";
import DiariasScreem from "./Views/homeAlumnos/DiariasScreem";
import MensualScreen from "./Views/homeAlumnos/MensualScreen";


import ProfesorScreen from "./Views/homeProfesorado/ProfesorScreen";
import PerfilScreen from "./Views/PerfilScreen";
import GestionEstudiantes from "./Views/screenAdmin/GestionEstudiantes";
import DescripcionEstudiante from "./Views/screenAdmin/DescripcionEstudiante";
import CrearEstudiante from "./Views/screenAdmin/CrearEstudiante";
import EstablecerContraseña from "./Views/screenAdmin/EstablecerContraseña";
import { useFonts } from 'expo-font';
import { scaleFont, styles } from "./styles/styles";



const Stack = createNativeStackNavigator();
const api = new ConnectApi();
SplashScreen.preventAutoHideAsync();


function Splash() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#FF8C42"/>
      <Text 
        style={[
          styles.text,
          {
            fontFamily: "ecolar-bold",
            marginTop: 20,
            fontSize: scaleFont(18),
            fontWeight: "bold",
            color: "#333",
          },
        ]}
      >
        CARGANDO SESIÓN...
      </Text>
    </View>
  );
}

//Configuracion del calendario 
LocaleConfig.locales["es"] = {
    monthNames: [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ],
    monthNamesShort: [
      "Ene.",
      "Feb.",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul.",
      "Ago",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dic.",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    dayNamesShort: ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"],
    today: "Hoy",
  };
LocaleConfig.locales["es"].firstDay = 1;
LocaleConfig.defaultLocale = "es";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [user, setUser] = useState({
    foto: null,
    username: null,
  });

  // Cargar las tipografias 
  const [fontsLoaded] = useFonts({
    'fredoka': require('./assets/fonts/fredoka.ttf'),
    'escolar': require('./assets/fonts/escolar_G.ttf'),
    'escolar-bold' : require('./assets/fonts/escolar-bold.ttf'),
  });
  

  const checkSession = async () => {
    try {
      const response = await api.checkSession();
    
      if (!response.ok) {
        setInitialRoute("Home");
      } else {
        if(response.tipo === "estudiante"){
          setUser({
            foto: response.foto,
            username: response.username,
            accesibilidad: response.accesibilidad, 
            asistenteVoz: response.asistenteVoz,
            preferenciasVisualizacion: response.preferenciasVisualizacion, 
            sexo: response.sexo, 
          });
          if(response.preferenciasVisualizacion === "diarias"){
            setInitialRoute("DiariasScreem");
            return;
          } 
          else if(response.preferenciasVisualizacion === "semanales"){
            //HAY QUE CAMBIAR ESTO  
            setInitialRoute("MensualScreen");
            return;
          }
          
        }else{
          setUser({ foto: response.foto, username: response.username});
          if (response.tipo === "admin"){ 
            setInitialRoute("AdminScreen"); 
            return;
          }
          else if (response.tipo === "profesor"){ 
            setInitialRoute("ProfesorScreen");
            return; 
          }
        }
        setInitialRoute("Home");
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setInitialRoute("LoginAlumno");
      setUser({ foto: null, username: null });
    }
  };
  

  useEffect(() => {
    checkSession();
  }, []);
  
  const onLayoutRootView = useCallback(async () => {
    if(fontsLoaded && initialRoute) await SplashScreen.hideAsync()
  }, [fontsLoaded, initialRoute]);
  if(!fontsLoaded || !initialRoute) return <Splash />; 

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
    <PaperProvider>
    <UserContext.Provider value={{user, setUser}}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen}/>

        
        <Stack.Screen name="Profesorado" component={Profesorado} />
        <Stack.Screen name="LoginAlumnoAlfanumerica" component={LoginAlumnoAlfanumerica} />
        <Stack.Screen name="LoginAlumnoPin" component={LoginAlumnoPin} />
        <Stack.Screen name="LoginAlumnoImagenes" component={LoginAlumnoImagenes} />
        
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="ProfesorScreen" component={ProfesorScreen} />
        <Stack.Screen name="DiariasScreem" component={DiariasScreem} />
        <Stack.Screen name="MensualScreen" component={MensualScreen} />
        
        <Stack.Screen name="PerfilScreen" component={PerfilScreen} />


        <Stack.Screen name="GestionEstudiantes" component={GestionEstudiantes} />
        <Stack.Screen name="DescripcionEstudiante" component={DescripcionEstudiante}/>
        <Stack.Screen name="CrearEstudiante" component={CrearEstudiante}/>
        <Stack.Screen name="EstablecerContraseña" component={EstablecerContraseña}/>
        
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext.Provider>
    </PaperProvider>
    </View>
  );
}
