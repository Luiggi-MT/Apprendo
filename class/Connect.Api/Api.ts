import * as Notifications from 'expo-notifications'; 
import * as Device from 'expo-device'; 
import { Platform } from 'react-native';
import Constants from 'expo-constants';
export class Api {
    protected static apiUrl: string = "http://192.168.1.140:5000";
    //protected static apiUrl: string = "http://10.0.2.2:5000"; // android 
    //protected static apiUrl: string = "http://localhost/api";
    //protected static apiUrl: string = "http://3.122.246.141/api"
    protected static readonly LIMIT: number = 6;
    protected static readonly INITIAL_OFFSET: number = 0;
    constructor() {
        //this.apiUrl = "http://localhost/api";
    }

    public getApiUrl(): string {
        return Api.apiUrl;
    }
    public getLimit(): number {
        return Api.LIMIT;
    }
    public getInitial_offset(): number{
        return Api.INITIAL_OFFSET;
    }
    public getUrl(): string{
        return Api.apiUrl;
    }
    
    protected async registrarDispositivo(idUser: number): Promise<string | undefined> {
        let token; 

        if (Device.isDevice) {
            // 1. Verificar permisos actuales
            const { status: existingStatus } = await Notifications.getPermissionsAsync(); 
            let finalStatus = existingStatus; 

            // 2. Pedir permisos si no los tenemos
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status; 
            }

            // 3. Si el usuario rechaza, salimos
            if (finalStatus !== 'granted') {
                console.warn('Permisos de notificación denegados');
                return undefined;
            }

            // 4. Obtener el projectId desde la configuración de Expo (EAS)
            const projectId = 
                Constants?.expoConfig?.extra?.eas?.projectId ?? 
                Constants?.easConfig?.projectId;

            if (!projectId) {
                console.error("Error: projectId no encontrado. Revisa app.json");
                return undefined;
            }

            // 5. Obtener el token de los servidores de Expo
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: projectId,
            })).data;
            
        } else {
            console.log('Aviso: Las notificaciones push no funcionan en simuladores.');
        }

        // 6. Configuración específica para Android (Canales)
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }
}
