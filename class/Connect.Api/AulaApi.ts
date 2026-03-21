import { ApiResponseAulas } from "../Interface/ApiResponseAulas";
import { Aula } from '../Interface/Aula';
import { Api } from "./Api";

export class AulaApi extends Api {
    public async getAulas( offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<ApiResponseAulas> {
        try{
            const response = await fetch(`${Api.apiUrl}/aulas?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseAulas = await response.json();
            return data;
        }catch{
            return { total: 0, offset: 0, limit: 0, aulas: [] };
        }
    }

    public async createAula(nombre: string): Promise<boolean> {
        try{
            const response = await fetch(`${Api.apiUrl}/aulas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre }),
            });
            
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.ok;
        }catch{
            return false;
        }
    }

    public async getAulaByName(nombre: string, offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<ApiResponseAulas> {
        try{
            const response = await fetch(`${Api.apiUrl}/aulas/buscar?nombre=${encodeURIComponent(nombre)}&offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseAulas = await response.json();
            return data;
        }catch{
            return { total: 0, offset: 0, limit: 0, aulas: [] };
        }
    }

    public async getAulaById(id: number): Promise<Aula>{
        try{
            const response = await fetch(`${Api.apiUrl}/aulas/${id}`); 
            if(!response.ok){
                throw new Error("Network response was not ok"); 
            }
            const data: Aula = await response.json(); 
            return data;
        }catch{
            return null;
        }
    }

    public async asignarProfesorAula(profesorId: number, aulaId: number): Promise<boolean> {
        try{
            const response = await fetch(`${Api.apiUrl}/aulas/asignar-profesor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    'profesor_id' : profesorId,
                    'aula_id' : aulaId }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.ok;
        }catch{
            return false;
        }
    }

    public async desasignarProfesorAula(profesorId: number, aulaId: number): Promise<boolean>{
        try{
            const response = await fetch(`${Api.apiUrl}/aulas/eliminar-profesor`, {
                method: "POST", 
                headers: {
                    "Content-Type" : "application/json", 
                }, 
                body: JSON.stringify({
                    'profesor_id': profesorId, 
                    'aula_id' : aulaId,
                }),
            }); 
            if (!response.ok){
                throw new Error("Network response was not ok"); 
            }
            return response.ok;
        }catch{
            return false;
        }
    }

    public async deletaAula(aulaId: number): Promise<boolean>{
        try{
            const response = await fetch(`${Api.apiUrl}/delete-aula/${aulaId}`,{
                method : "DELETE", 
                headers: {
                    "Content-Type" : "application/json",
                }
            }); 
            if(!response.ok){
                throw new Error("Network response was not ok"); 
            }
            return response.ok; 
        }catch{
            return false;
        }
    }
}