export class Formatear {
    private static meses: string[] = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];

    
    public static formatearFecha(fechaStr: string): string {
        if (!fechaStr) return "";

        
        const partes = fechaStr.split("-");
        if (partes.length !== 3) return fechaStr; 

        const year = partes[0];
        const month = partes[1];
        const day = partes[2];

        
        const mesNombre = this.meses[parseInt(month) - 1];
        const diaNum = parseInt(day);

        return `${diaNum} DE ${mesNombre} DEL ${year}`;
    }
}