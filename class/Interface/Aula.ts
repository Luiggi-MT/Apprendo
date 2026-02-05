export interface Aula{
    id: number;
    nombre_aula: string;
    id_profesor?: number;
    foto_profesor?: string; 
    nombre_profesor?:string;
    visitado?: boolean;
    id_visita?: number;

}