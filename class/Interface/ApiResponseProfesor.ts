import { Profesor } from "./Profesor";

export interface ApiResponseProfesor {
    profesores: Profesor[];
    offset: number;
    count: number;
    total?:number;
}