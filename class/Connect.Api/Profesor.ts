import { ApiResponse } from "../Interface/ApiResponse";
import { ApiResponseProfesor } from "../Interface/ApiResponseProfesor";
import { Profesor } from "../Interface/Profesor";
import { Api } from "./Api";

export class ProfesorApi  extends Api{ 
    public async getProfesores(offset: number, limit: number): Promise<ApiResponseProfesor> {
        const response = await fetch(
            `${this.getUrl()}/profesores?offset=${offset}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!response.ok){
            throw new Error(`Error fetching profesores: ${response.statusText}`);
        }
        return response.json();
    }

    public async getProfesorByName(
        name: string,
        offset: number,
        limit: number
    ): Promise<ApiResponseProfesor> {
        const response = await fetch(
            `${this.getUrl()}/profesores/buscar?name=${encodeURIComponent(
                name
            )}&offset=${offset}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!response.ok){
            throw new Error(`Error fetching profesor by name: ${response.statusText}`);
        }
        return response.json();
    }   

    public async getProfesorById(id: number): Promise<Profesor>{
        try{
            const response = await fetch(`${Api.apiUrl}/profesores/${id}`);
            if(!response.ok){
                throw new Error(`Error fetching profesor by id: ${response.statusText}`)
             }
            const data: Profesor = await response.json(); 
            return data; 
        }catch{
            return null;
        }
        
    }

    public async createProfesor(username: string, palabraClave: string): Promise<boolean>{
        try{
            const response = await fetch(`${Api.apiUrl}/profesores/create`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'username' : username, 
                    'palabra-clave': palabraClave,
                })
            });
            if(!response.ok){
                throw new Error(`Error create profesor: ${response.statusText}`);
            }
            return response.ok; 
        }catch{
            return false;
        }
    }

    public async setContraseña(username: string, password: string, palabraClave: string): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/profesores/contraseña`, {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'username' : username, 
                    'password' : password, 
                    'palabra-clave' : palabraClave,
                })
            });
            
            const data = await response.json();
            if(!data.ok){
                return {
                    'ok': false, 
                    'message': data.error,
                }
            }
            return {
                'ok' : true, 
                'message': data.message}; 
        }catch{
            return {
                'ok': false, 
                'message': "Error",
            };
        }
    }
}