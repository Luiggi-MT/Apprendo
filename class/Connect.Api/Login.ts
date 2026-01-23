import * as SecureStore from 'expo-secure-store';
import { ImagePassword } from "../Interface/ImagePassword";
import { LoginResponse } from "../Interface/LoginResponse";
import { LoginResponseStudnet } from "../Interface/LoginResponseStudent";
import { Api } from "./Api";

export class Login extends Api {
    
    // Función auxiliar para obtener el token guardado
    private async getAuthHeader() {
        const token = await SecureStore.getItemAsync('userToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    public async loginUser(userName: string, password: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${Api.apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'username': userName, 'password': password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { ok: false, message: data.error || "Credenciales inválidas" };
            }

            // --- PASO CLAVE: Guardar el Token JWT ---
            if (data.access_token) {
                await SecureStore.setItemAsync('userToken', data.access_token);
            }

            return { ...data, ok: true };
        
        } catch (error: any) {
            return { ok: false, message: "Error de conexión con el servidor" };
        }
    }

    public async logoutUser(): Promise<boolean> {
        try {
            // En JWT el logout es principalmente borrar el token del cliente
            await SecureStore.deleteItemAsync('userToken');
            return true;
        } catch (error) {
            return false;
        }
    }

    public async checkSession(): Promise<LoginResponse> {
        try {
            const authHeader = await this.getAuthHeader();
            
            // Si ni siquiera hay token guardado, no intentamos la petición
            if (!authHeader.Authorization) {
                return { ok: false, message: "No active session" };
            }

            const response = await fetch(`${Api.apiUrl}/session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader // Enviamos el Bearer Token
                },
            });

            const data = await response.json();
            
            if (response.status === 401) {
                await SecureStore.deleteItemAsync('userToken'); // Limpiar si el token expiró
                return { ok: false, message: "Session expired" };
            }

            return { ...data, ok: response.ok };
        } catch (error: any) {
            return { ok: false, message: "Error checking session" };
        }
    }

    public async loginStudent(id: number, tipoContraseña: string, password?: string, passwordImage?: ImagePassword[]): Promise<LoginResponseStudnet> {
        try {
            const response = await fetch(`${Api.apiUrl}/login_student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'id': id,
                    'password': password,
                    'tipoContraseña': tipoContraseña, 
                    'passwordImage' : passwordImage, 
                }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                return { ok: false, message: data.error, fallos: data.fallos } as LoginResponseStudnet;
            }

            // --- Guardar Token del Estudiante ---
            if (data.access_token) {
                await SecureStore.setItemAsync('userToken', data.access_token);
            }
            
            return { ...data, ok: true };
        } catch (error: any) {
            return { ok: false, message: "Error de red" } as LoginResponseStudnet;
        }
    }
}