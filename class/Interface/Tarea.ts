export interface Tarea {
    id?: number; 
    id_pictograma: number; 
    nombre: string; 
    categoria: string;
}

export interface TareaEstudiante {
    tarea_id?: number; 
    estudiante_id?: number; 
    fecha?: number; 
    completado?: number;
    categoria?: string; 
    id?: number; 
    nombre?: string; 
    id_pictograma?: number;
}