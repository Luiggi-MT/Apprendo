import * as Notifications from 'expo-notifications'; 
import * as Device from 'expo-device'; 
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Storage } from '../Storage/Storage';
export class Api {
    private static readonly TOKEN_KEY = 'userToken';

    protected static async getAuthHeader(): Promise<Record<string, string>> {
        const token = await Storage.getItem(Api.TOKEN_KEY);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    //protected static apiUrl: string = "http://127.0.0.1:5000";
    protected static apiUrl: string = "http://192.168.1.129:5000";
    //protected static apiUrl: string = "https://apprendo.duckdns.org/api";
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

        if (!Device.isDevice) {
            console.warn('Aviso: Las notificaciones push no funcionan en simuladores.');
            return undefined;
        }

        try {
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
                console.warn('Permisos de notificación denegados por el usuario');
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
            
        } catch (error: any) {
            console.error('No se pudo obtener el token de notificaciones push:', error);
            console.error('Detalles del error:', JSON.stringify(error, null, 2));
            return undefined;
        }

        // 6. Configuración específica para Android (Canales)
        if (Platform.OS === 'android') {
            try {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            } catch (error) {
                console.error('Error al configurar canal de notificaciones:', error);
            }
        }

        return token;
    }
}
