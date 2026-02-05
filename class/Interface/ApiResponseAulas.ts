import { Aula } from "./Aula";

export interface ApiResponseAulas {
    total: number;
    offset: number;
    limit: number;
    aulas: Aula[];
}