import { Api } from "./Api";

export class OpenAI extends Api{
    public async enviarAudio(uri: string){
        const formData = new FormData();

        formData.append("audio", {
            uri, 
            name: "voz.m4a", 
            type: "audio/m4a",
        } as any);

        const response = await fetch(`${Api.apiUrl}/speech-to-text`, {
            method: "POST", 
            body: formData,
        });
        
        const data = await response.json(); 
        return data.text;
    }
}