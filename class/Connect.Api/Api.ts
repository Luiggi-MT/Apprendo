import * as Notifications from 'expo-notifications'; 
import * as Device from 'expo-device'; 
import { Platform } from 'react-native';
import Constants from 'expo-constants';
export class Api {
    //protected static apiUrl: string = "http://localhost:5000";
    protected static apiUrl: string = "https://apprendo.duckdns.org/api";
    protected static readonly LIMIT: number = 6;
    protected static readonly INITIAL_OFFSET: number = 0;
    constructor() {
        
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
            try {
                token = (await Notifications.getExpoPushTokenAsync({
                    projectId: projectId,
                })).data;
            } catch (error: any) {
                console.warn('No se pudo obtener el token de notificaciones push:', error.message);
                return undefined;
            }
            
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
