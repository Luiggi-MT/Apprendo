export class Arasaac {

    private pictograma: Map<string, number> = new Map([
        //usuarios
        ["profesor", 2457],
        ["estudiante", 5900],
        //Botones de avanzar y retroceder
        ["atras", 38250], 
        ["delante", 38252],

        ["buscador", 39110],

        ["volver", 37086], 
        ["entrar", 6491],
        ["borrar", 37417], 
        ["ok", 5584], 

        ["olvideContraseña", 27367],

        //Iconos del Header
        ["paginaPrincipal", 6964],
        ["lista", 30207],
        
        //Iconos de botones 
        ["tareasPeticion", 33084],
        ["chat", 37867],
        ["tareasPorPasos", 36347],
        ["perfil", 36935],
        ["salir", 6606],
        ["mas", 3220],
        ["grafica", 9174],

        // X para tachar cuando algo se ha realizado
        ["x", 3046],

        //Numeros
        ["cero", 6972],
        ["uno", 35677],
        ["dos", 35679],
        ["tres", 35681],
        ["cuatro", 35665], 
        ["cinco", 35631], 
        ["seis",  35683], 
        ["siete", 35685], 
        ["ocho", 35687], 
        ["nueve", 35689], 

        // X en color rojo para cuando hay un error
        ["fallo", 5526],

    ]);
    private apiUrl: string = `https://api.arasaac.org/v1/pictograms/`;
    
    public getPictograma(word: string): string{
        const id = this.pictograma.get(word);
        if(id){
            return `${this.apiUrl}${id}`;
        }
        return "";
        
    }
}
