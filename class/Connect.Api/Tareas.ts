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

    public async createTareaComandaMaterialEscolar(): Promise<boolean>{
        try{

            const response = await fetch(`${Api.apiUrl}/tareas-material-escolar`, {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
            }); 
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return true; 
        }catch{
            return false;
        }
    }

    public async deleteTareaMaterialEscolar(): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/tareas-material-escolar/`, {
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

    public async createTareaComanda(): Promise<boolean>{
        try{

            const response = await fetch(`${Api.apiUrl}/tareas-comanda`, {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
               
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

    public async asignarTareaPedido(tareaId: number, studentId: number, profesorId: number, fechaInicio: string, fechaFin: string): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/asignar-tarea-pedido`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'id_tarea': tareaId,
                    'id_estudiante': studentId,
                    'id_profesor': profesorId,
                    'fecha_inicio': fechaInicio,
                    'fecha_fin': fechaFin
                })
            });

            return response.ok;
        } catch (error) {
            console.error("Error de red al asignar tarea de pedido:", error);
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

    public async finalizarTarea(tarea_id: number, estudiante_id: number, fecha: string): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/finalizar-tarea`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tarea_id,
                        estudiante_id,
                        fecha,
                    }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al finalizar la tarea:", errorData);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error al finalizar la tarea:", error);
            return false;
        }
    }

    public async getTareasPeticionProfesor(profesorId: number, offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT, fecha: string): Promise<ApiResponseTareas>{
        try{
            const response = await fetch(`${Api.apiUrl}/tareas-peticion-profesor/${profesorId}?offset=${offset}&limit=${limit}&fecha=${fecha}`);
            if(!response.ok){
                throw new Error("Network response was not ok");   
            }
            const data: ApiResponseTareas = await response.json();
            return data;
        }catch{
            return { ok: false, tareas: [], offset: 0, count: 0 };
        }
    }

    public async asignarTareaPedidoMaterial(materialesSeleccionados: { materialId: number; cantidad: number }[], tareaId: number, profesor_id: number): Promise<string | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/asignar-material-profesor`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    materiales: materialesSeleccionados, 
                    id_tarea: tareaId,
                    profesor_id: profesor_id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return errorData.error;
            }

            return null;
        } catch (error) {
            return error instanceof Error ? error.message : String(error);
            
        }
    }
    public async getTareaMaterialMateriales(id_tarea_estudiante: number, fecha: string, student_id: number): Promise<any[]> {
        try {
            const response = await fetch(`${Api.apiUrl}/tarea-material-materiales`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_tarea_estudiante, fecha, student_id }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error("Error al obtener los materiales de la tarea:", error);
            return [];
        }
    }
}