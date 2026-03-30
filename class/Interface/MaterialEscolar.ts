export interface MaterialEscolar {
    id?: number;
    nombre?: string;
    color?: string;
    pictogramaId?: number;
    cantidad?: number;
    forma?: string;
    tamaño?: string;
    imagen?: string;
    video?: string;
}

export interface materialEscolarResponse {
    materialesEscolares: MaterialEscolar[];
    offset: number;
    count: number;
}