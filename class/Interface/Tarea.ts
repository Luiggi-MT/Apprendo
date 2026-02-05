export interface Tarea {
    id: number; 
    titulo: string; 
    uri: number; 
    fecha_inicio: string; 
    fecha_fin: string; 
    esta_pendiente: boolean; 
    id_tarea_estudiante?: number;
}