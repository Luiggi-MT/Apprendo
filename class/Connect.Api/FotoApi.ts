import { Api } from "./Api";

export class FotoApi extends Api{
    public getFoto(filename: string): string {
        return `${Api.apiUrl}/foto/${filename}`;
    } 
    public getMedia(filename: string): string {
        return `${Api.apiUrl}/${filename}`;
    }
}