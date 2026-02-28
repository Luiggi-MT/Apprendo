import { Tarea, TareaEstudiante } from "./Tarea";

export interface ApiResponseTareas{
    ok: boolean;
    tareas?: Tarea[];
    tareasEstudiante?: TareaEstudiante[];
    offset: number;
    count: number;
}