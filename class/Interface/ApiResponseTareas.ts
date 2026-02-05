import { Tarea } from "./Tarea";

export interface ApiResponseTareas{
    ok: boolean;
    tareas: Tarea[];
    offset: number;
    count: number;
}