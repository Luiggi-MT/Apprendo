import { ApiResponseTareas } from "../Interface/ApiResponseTareas";
import { Api } from "./Api";

export class TareasApi extends Api{
    public async getTareas(offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<ApiResponseTareas>{
        try{
            const response = await fetch(`${Api.apiUrl}/tareas?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseTareas = await response.json();
            return data;
        }catch{
            return { ok: false, tareas: [], offset: 0, count: 0 };
        }
    }

    public async getTareaComanda(): Promise<boolean>{
        try{
            const response = await fetch(`${Api.apiUrl}/tareas-comanda`); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data.exists;
        }catch{
            return false;
        }
    }

    public async createTareaComanda(uri: number, titulo: string, id_profesor: number): Promise<boolean>{
        try{
            console.log("TAREAS.TS")
            console.log("uri", uri)
            console.log("titulo", titulo)
            console.log("id_profesor", id_profesor)

            const response = await fetch(`${Api.apiUrl}/tareas-comanda`, {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'uri' :  uri, 
                    'titulo' : titulo, 
                    'id-profesor' : id_profesor, 
                })
            }); 
            
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return true; 
        }catch{
            return false;
        }
    }

    public async deleteTareaComanda(): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/tareas-comanda/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }, 
            
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData.error);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error de red al eliminar tarea:", error);
            return false;
        }
    }

    public async asignarTarea(tareaId: number, studentId: number, fechaInicio: string, fechaFin: string): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/asignar-tarea`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'id_tarea': tareaId,
                    'id_estudiante': studentId,
                    'fecha_inicio': fechaInicio,
                    'fecha_fin': fechaFin
                })
            });

            return response.ok;
        } catch (error) {
            console.error("Error de red al asignar tarea:", error);
            return false;
        }
    }

    public async getTareaEstudiante(estudianteId: number, offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT, fecha: string): Promise<ApiResponseTareas>{
        try{
            const response = await fetch(`${Api.apiUrl}/tareas/${estudianteId}?offset=${offset}&limit=${limit}&fecha=${fecha}`);
            if(!response.ok){
                throw new Error("Network response was not ok");   
            }
            const data: ApiResponseTareas = await response.json();
            return data;
        }catch{
            return { ok: false, tareas: [], offset: 0, count: 0 };
        }
    }

    
    public async getResumenMensual(estudianteId: number, mes: string): Promise<Record<string, { todas_hechas: boolean }>> {
        try {
            const response = await fetch(`${Api.apiUrl}/resumen-mensual/${estudianteId}?mes=${mes}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener el resumen mensual");
            }

            const data = await response.json();
        
            return data;
        } catch (error) {
            console.error("Error en getResumenMensual: ", error);
            return {};
        }
    }

    public async finalizarTarea(id: number): Promise<boolean>{
        try{
            const response = await fetch(`${Api.apiUrl}/finalizar-tarea/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener el resumen mensual");
            }
            return true; 
        }catch (error){
            console.error("Error al finalizar la tareae: ", error); 
            return false;
        }
    }
}