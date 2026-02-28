export interface Plato{
    id_pictograma: number;
    nombre: string;
    categoria: "primero" | "segundo" | "guarnicion" | "postre";
        
}
export interface Menu{
    id?: number; 
    id_pictograma: number; 
    descripcion: string;
    tachado: boolean;
    platos?: Plato[];
    categoria: "menu" | "postre";
    limit?: number;
    offset?: number;
}