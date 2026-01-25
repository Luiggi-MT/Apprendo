export interface Plato{
    id_pictograma: number;
    nombre: string;
    categoria: "primero" | "segundo" | "guarnicion" | "postre";
        
}
export interface Menu{
    id: number; 
    id_pictograma: number; 
    nombre: string; 
    descripcion: string;
    tachado: boolean;
    fecha?: string;
    platos?: Plato[];
}