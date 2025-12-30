import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConnectApi } from "./class/Connect.Api/ConnectApi";
import { UserContext } from "./class/context/UserContext";
import { PaperProvider } from "react-native-paper";

import HomeScreen from "./Views/HomeScreen";
import Profesorado from "./Views/Profesorado";
import LoginAlumnoAlfanumerica from "./Views/LoginAlumnoAlfanumerica";
import LoginAlumnoImagenes from "./Views/LoginAlumnoImagenes";
import LoginAlumnoPin from "./Views/LoginAlumnoPin";
import AdminScreen from "./Views/AdminScreen";
import ProfesorScreen from "./Views/ProfesorScreen";
import PerfilScreen from "./Views/PerfilScreen";
import GestionEstudiantes from "./Views/GestionEstudiantes";
import DescripcionEstudiante from "./Views/DescripcionEstudiante";
import CrearEstudiante from "./Views/CrearEstudiante";
import EstablecerContraseña from "./Views/EstablecerContraseña";



const Stack = createNativeStackNavigator();
const api = new ConnectApi();

function Splash() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Cargando sesión</Text>
    </View>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [user, setUser] = useState({
    foto: null,
    username: null,
  });

  const checkSession = async () => {
    try {
      const response = await api.checkSession();
      if (!response.ok) {
        setInitialRoute("Home");
        setUser({ foto: null, username: null });
      } else {
        setUser({ foto: response.foto, username: response.username});

        if (response.tipo === "admin") setInitialRoute("AdminScreen");
        else if (response.tipo === "profesor") setInitialRoute("ProfesorScreen");
        else setInitialRoute("Home");
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



  if (!initialRoute) return <Splash />;
  
  return (
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
        
        <Stack.Screen name="PerfilScreen" component={PerfilScreen} />


        <Stack.Screen name="GestionEstudiantes" component={GestionEstudiantes} />
        <Stack.Screen name="DescripcionEstudiante" component={DescripcionEstudiante}/>
        <Stack.Screen name="CrearEstudiante" component={CrearEstudiante}/>
        <Stack.Screen name="EstablecerContraseña" component={EstablecerContraseña}/>
        
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext.Provider>
    </PaperProvider>
  );
}
