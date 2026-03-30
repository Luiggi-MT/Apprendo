import { ImagePassword } from "../Interface/ImagePassword";
import { LoginResponse } from "../Interface/LoginResponse";
import { LoginResponseStudnet } from "../Interface/LoginResponseStudent";
import { Api } from "./Api";
import { Storage } from "../Storage/Storage";



export class Login extends Api {
    
    private static TOKEN_KEY = 'userToken';
    private static USER_TYPE_KEY = 'userType';
    private static SESSION_EXPIRY_KEY = 'sessionExpiry';

    private async vincularNotificaciones(idEstudiante: number): Promise<void> {
        try {
            
            const token = await this.registrarDispositivo(idEstudiante);
            
            if (!token) {
                console.warn("No se pudo obtener el Expo Push Token.");
                return;
            }

            const response = await fetch(`${Api.apiUrl}/guardar-token`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'id_estudiante': idEstudiante,
                    'token': token
                })
            });

            if (!response.ok) {
                console.error("Error al guardar el token en el backend.");
            }
        } catch (error) {
            console.error("Error crítico en el proceso de vinculación de notificaciones:", error);
        }
    }
    private async vincularNotificacionesProfesor(idProfesor: number): Promise<void> {
        try {
            
            const token = await this.registrarDispositivo(idProfesor);
            
            if (!token) {
                console.warn("No se pudo obtener el Expo Push Token para el profesor.");
                return;
            }

            const response = await fetch(`${Api.apiUrl}/guardar-token-profesor`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'id_profesor': idProfesor,
                    'token': token
                })
            });

            if (!response.ok) {
                console.error("Error al guardar el token del profesor en el backend.");
            }
        } catch (error) {
            console.error("Error crítico en el proceso de vinculación de notificaciones para el profesor:", error);
        }
    }
    private async getAuthHeader() {
        const token = await Storage.getItem(Login.TOKEN_KEY);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    private async isTokenExpired(): Promise<boolean> {
        const expiry = await Storage.getItem(Login.SESSION_EXPIRY_KEY);
        if (!expiry) return true;
        return new Date(expiry) < new Date();
    }

    private async saveSessionInfo(token: string, expiresIn?: number): Promise<void> {
        try{
            await Storage.setItem(Login.TOKEN_KEY, token);
            if (expiresIn) {
                const expiryDate = new Date();
                expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
                await Storage.setItem(Login.SESSION_EXPIRY_KEY, expiryDate.toISOString());
            }
        }catch(e){
            console.error(e);
        }
        
    }

    public async loginUser(userName: string, password: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${Api.apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userName,
                    password: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                await Storage.deleteItem(Login.TOKEN_KEY);
                return {
                    ok: false,
                    message: data.error || "Credenciales inválidas"
                };
            }

            if (data.access_token) {
                
                await this.saveSessionInfo(data.access_token, data.expires_in);
                await Storage.setItem(Login.USER_TYPE_KEY, data.tipo);

                // Vincular notificaciones para el profesor
                if (data.id) {
                    await this.vincularNotificacionesProfesor(data.id);
                }
            }

            return { ...data, ok: true };

        } catch (error: any) {
            console.error('Login error:', error);
            return { ok: false, message: "Error de conexión con el servidor" };
        }
    }

    public async loginStudent(id: number, tipoContraseña: string, password?: string, passwordImage?: ImagePassword[]): Promise<LoginResponseStudnet> {
        try {
            const response = await fetch(`${Api.apiUrl}/login_student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    password,
                    tipoContraseña,
                    passwordImage
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    ok: false,
                    message: data.error || "Error en el login",
                    fallos: data.fallos || [],
                    statusCode: response.status
                } as unknown as LoginResponseStudnet;
            }

            if (data.access_token) {
                await this.saveSessionInfo(data.access_token, data.expires_in);
                await Storage.setItem(Login.USER_TYPE_KEY, 'estudiante');

                
                await this.vincularNotificaciones(id);
            }

            return { ...data, ok: true } as LoginResponseStudnet;

        } catch (error: any) {
            console.error('Student login error:', error);
            return {
                ok: false,
                message: "Error de red",
                error: error.message
            } as unknown as LoginResponseStudnet;
        }
    }

    
    public async checkSession(): Promise<LoginResponse> {
        try {
            const token = await Storage.getItem(Login.TOKEN_KEY);
            if (!token) return { ok: false, message: "No hay sesión activa" };

            if (await this.isTokenExpired()) {
                await this.logoutUser();
                return { ok: false, message: "Sesión expirada" };
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${Api.apiUrl}/session`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            if (response.status === 401) {
                await this.logoutUser();
                return { ok: false, message: "Sesión expirada" };
            }

            return response.ok ? { ...data, ok: true } : { ok: false, message: data.error };
        } catch (error: any) {
            return { ok: false, message: "Error al verificar la sesión" };
        }
    }

    public async logoutUser(): Promise<boolean> {
        try {
            await Promise.all([
                Storage.deleteItem(Login.TOKEN_KEY),
                Storage.deleteItem(Login.SESSION_EXPIRY_KEY),
                Storage.deleteItem(Login.USER_TYPE_KEY)
            ]);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async getCurrentToken(): Promise<string | null> {
        return await Storage.getItem(Login.TOKEN_KEY);
    }

    public async isAuthenticated(): Promise<boolean> {
        const token = await this.getCurrentToken();
        if (!token) return false;
        return !(await this.isTokenExpired());
    }
}