import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConnectApi } from "./class/Connect.Api/ConnectApi";
import { UserContext } from "./class/context/UserContext";
import { PaperProvider } from "react-native-paper";
import { LocaleConfig } from "react-native-calendars";
import { useFonts } from 'expo-font';


import * as SplashScreen from 'expo-splash-screen'

import Splash from "./components/Splash";
//Acerca de
import AcercaDe from "./Views/AcercaDe/AcercaDe";

//Home 
import HomeScreen from "./Views/HomeScreen";

//Login
import Profesorado from "./Views/Profesorado";
import LoginAlumnoAlfanumerica from "./Views/loginAlumnos/LoginAlumnoAlfanumerica";
import LoginAlumnoImagenes from "./Views/loginAlumnos/LoginAlumnoImagenes";
import LoginAlumnoPin from "./Views/loginAlumnos/LoginAlumnoPin";

// Olvide contraseña 
import OlvideContraseña from "./Views/OlvideContraseña/OlvideContraseña";

//Páginas principales de los usuarios
import AdminScreen from "./Views/homeProfesorado/AdminScreen";
import DiariasScreem from "./Views/homeAlumnos/DiariasScreem";
import MensualScreen from "./Views/homeAlumnos/MensualScreen";
import ProfesorScreen from "./Views/homeProfesorado/ProfesorScreen";

// Perfil 
import PerfilScreen from "./Views/PerfilScreen";

//Gestión de estudiantes -- Admin
import GestionEstudiantes from "./Views/screenAdmin/GestionEstudiantes/GestionEstudiantes";
import DescripcionEstudiante from "./Views/screenAdmin/GestionEstudiantes/DescripcionEstudiante";
import CrearEstudiante from "./Views/screenAdmin/GestionEstudiantes/CrearEstudiante";
import EstablecerContraseña from "./Views/screenAdmin/GestionEstudiantes/EstablecerContraseña";
//--->Asignación de tareas
import AsignacionTareas from "./Views/screenAdmin/GestionEstudiantes/AsignacionTareas/AsignacionTareas";
import AsignarTarea from "./Views/screenAdmin/GestionEstudiantes/AsignacionTareas/AsignarTarea";

// Gestion de tareas de petición 
import TareaPeticion from "./Views/screenAdmin/GestionTareasPeticion/TareaPeticion";

// Comanda comedor 
import ListaMenus from "./Views/screenAdmin/GestionTareasPeticion/ComandaComedor/ListaMenus";
import ComandaComedor from "./Views/screenAdmin/GestionTareasPeticion/ComandaComedor/ComandaComedor";
import CrearMenu from "./Views/screenAdmin/GestionTareasPeticion/ComandaComedor/CrearMenu";
import DetalleMenu from "./Views/screenAdmin/GestionTareasPeticion/ComandaComedor/DetalleMenu";
import VerComanda from "./Views/screenAdmin/GestionTareasPeticion/ComandaComedor/VerComanda";
import DetalleComandaAula from "./Views/screenAdmin/GestionTareasPeticion/ComandaComedor/DetalleComandaAula";

//Gestion de aulas
import GestionAulas from "./Views/screenAdmin/GestionAulas/GestionAulas";
import CrearAula from "./Views/screenAdmin/GestionAulas/CrearAula";
import DetallesAula from "./Views/screenAdmin/GestionAulas/DetallesAula";
import AsignarProfesorAula from "./Views/screenAdmin/GestionAulas/AsignarProfesorAula";

//Gestion de profesores
import GestionProfesores from "./Views/screenAdmin/GestionProfesores/GestionProfesores";
import CrearProfesor from "./Views/screenAdmin/GestionProfesores/CrearProfesor";


//Añadir Pictograma
import AñadirPictograma from "./Views/screenAdmin/AñadirPictograma/AñadirPictograma";


import ComandaTarea from "./Views/homeAlumnos/ComandaTarea/ComandaTarea";
import ComandaAula from "./Views/homeAlumnos/ComandaTarea/ComandaAula";


const Stack = createNativeStackNavigator();
const api = new ConnectApi();
SplashScreen.preventAutoHideAsync();


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
            id: response.id,
            foto: response.foto,
            username: response.username,
            tipo: response.tipo,
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
          setUser({ id: response.id, foto: response.foto, username: response.username});
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
  if(!fontsLoaded || !initialRoute) return <Splash name="CARGANDO SESIÓN" />; 

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
    <PaperProvider>
    <UserContext.Provider value={{user, setUser}}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AcercaDe" component={AcercaDe} />
        <Stack.Screen name="Home" component={HomeScreen}/>

        
        <Stack.Screen name="Profesorado" component={Profesorado} />
        <Stack.Screen name="LoginAlumnoAlfanumerica" component={LoginAlumnoAlfanumerica} />
        <Stack.Screen name="LoginAlumnoPin" component={LoginAlumnoPin} />
        <Stack.Screen name="LoginAlumnoImagenes" component={LoginAlumnoImagenes} />

        <Stack.Screen name="OlvideContraseña" component={OlvideContraseña} />
        
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="ProfesorScreen" component={ProfesorScreen} />
        <Stack.Screen name="DiariasScreem" component={DiariasScreem} />
        <Stack.Screen name="MensualScreen" component={MensualScreen} />
        
        <Stack.Screen name="PerfilScreen" component={PerfilScreen} />


        <Stack.Screen name="GestionEstudiantes" component={GestionEstudiantes} />
        <Stack.Screen name="DescripcionEstudiante" component={DescripcionEstudiante}/>
        <Stack.Screen name="CrearEstudiante" component={CrearEstudiante}/>
        <Stack.Screen name="EstablecerContraseña" component={EstablecerContraseña}/>
        <Stack.Screen name="AsignacionTareas" component={AsignacionTareas} /> 
        <Stack.Screen name="AsignarTarea" component={AsignarTarea} /> 

        <Stack.Screen name="TareaPeticion" component={TareaPeticion} />

        <Stack.Screen name="ListaMenus" component={ListaMenus} />
        <Stack.Screen name="ComandaComedor" component={ComandaComedor} />
        <Stack.Screen name="CrearMenu" component={CrearMenu} />
        <Stack.Screen name="DetalleMenu" component={DetalleMenu} />
        <Stack.Screen name="VerComanda" component={VerComanda} />
        <Stack.Screen name="DetalleComandaAula" component={DetalleComandaAula} />

        <Stack.Screen name="GestionAulas" component={GestionAulas} />
        <Stack.Screen name="CrearAula" component={CrearAula} />
        <Stack.Screen name="DetallesAula" component={DetallesAula} />
        <Stack.Screen name="AsignarProfesorAula" component={AsignarProfesorAula} />

        <Stack.Screen name="GestionProfesores" component={GestionProfesores}/>
        <Stack.Screen name="CrearProfesor" component={CrearProfesor} />

        <Stack.Screen name="AñadirPictograma" component={AñadirPictograma} />

        <Stack.Screen name="ComandaTarea" component={ComandaTarea} />
        <Stack.Screen name="ComandaAula" component={ComandaAula} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext.Provider>
    </PaperProvider>
    </View>
  );
}
