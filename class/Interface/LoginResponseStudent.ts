export interface LoginResponseStudnet{
    ok?: boolean;
    message?: string;
    username: string; 
    foto: string; 
    accesibilidad?: string[];
    asistenteVoz: string; 
    id: number;
    preferenciasVisualizacion: string;
    sexo: string;
    tipoContraseña: string;
    fallos?: number[]; 
  
}