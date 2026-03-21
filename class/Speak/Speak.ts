import * as Speech from "expo-speech";

export class Speak {
  private mes = new Map<number, string>([
    [1, "Enero"], 
    [2, "Febrero"], 
    [3, "Marzo"],
    [4, "Abril"],
    [5, "Mayo"],
    [6, "Junio"],
    [7, "Julio"],
    [8, "Agosto"],
    [9, "Septiembre"],
    [10, "Octubre"],
    [11, "Noviembre"],
    [12, "Diciembre"]
]);

  private static instance: Speak;
  private isSpeaking = false;

  private constructor() {}

  static getInstance(): Speak {
    if (!Speak.instance) {
      Speak.instance = new Speak();
    }
    return Speak.instance;
  }

  private async obtenerMejorVoz() {
    const voces = await Speech.getAvailableVoicesAsync();
  
    return voces.find(v => v.language.startsWith('es') && v.quality === Speech.VoiceQuality.Enhanced) 
         || voces.find(v => v.language.startsWith('es'));
  }
  public async hablar(texto: string): Promise<void> {
    const mejorVoz = await this.obtenerMejorVoz();
    return new Promise((resolve) => {
      this.isSpeaking = true;

      Speech.speak(texto, {
        language: "es",
        voice: mejorVoz?.identifier,
        rate: 0.9,
        pitch: 1,
        onDone: () => {
          this.isSpeaking = false;
          resolve();
        },
        onStopped: () => {
          this.isSpeaking = false;
          resolve();
        },
      });
    });
  }

  public detener() {
    Speech.stop();
    this.isSpeaking = false;
  }

  public estaHablando(): boolean {
    return this.isSpeaking;
  }

  public getNombreMes(mes: number): string {
    return this.mes.get(mes) || "Mes inválido";
  }

  public formatearFechaVerbal = (fecha: string): string => {
      const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
  
      const numerosPalabra: { [key: number]: string } = {
        0: "cero",
        1: "uno",
        2: "dos",
        3: "tres",
        4: "cuatro",
        5: "cinco",
        6: "seis",
        7: "siete",
        8: "ocho",
        9: "nueve",
        10: "diez",
        11: "once",
        12: "doce",
        13: "trece",
        14: "catorce",
        15: "quince",
        16: "dieciséis",
        17: "diecisiete",
        18: "dieciocho",
        19: "diecinueve",
        20: "veinte",
        21: "veintiuno",
        22: "veintidós",
        23: "veintitrés",
        24: "veinticuatro",
        25: "veinticinco",
        26: "veintiséis",
        27: "veintisiete",
        28: "veintiocho",
        29: "veintinueve",
        30: "treinta",
        31: "treinta y uno",
      };
  
      // Parse de la fecha YYYY-MM-DD
      const [año, mes, dia] = fecha.split("-");
      const mesIndex = parseInt(mes) - 1;
      const diaNum = parseInt(dia);
      const añoNum = parseInt(año);
  
      // Convertir año a palabras
      const convertirAño = (año: number): string => {
        if (año < 2000) {
          const miles = Math.floor(año / 1000);
          const resto = año % 1000;
          if (resto === 0) return `${miles} mil`;
          const cientos = Math.floor(resto / 100);
          const unidadesDecenas = resto % 100;
  
          let resultado = `${miles} mil`;
          if (cientos > 0)
            resultado += ` ${cientos}cientos${unidadesDecenas > 0 ? " " : ""}`;
          if (unidadesDecenas > 0)
            resultado += numerosPalabra[unidadesDecenas] || "";
          return resultado;
        }
  
        // Para años 2000+
        const miles = Math.floor(año / 1000);
        const resto = año % 1000;
  
        if (miles === 2 && resto < 100) {
          // Años 2000-2099
          if (resto === 0) return "dos mil";
          const dezena = Math.floor(resto / 10);
          const unidad = resto % 10;
  
          if (dezena === 0) return `dos mil ${numerosPalabra[unidad] || ""}`;
          if (dezena === 1) return `dos mil ${numerosPalabra[resto] || ""}`;
  
          // Para 20-99 (veintiuno, veintiséis, treinta, treinta y cinco, etc.)
          if (resto <= 29) {
            return `dos mil ${numerosPalabra[resto] || ""}`;
          } else {
            // 30-99: treinta, cuarenta, etc.
            const decenas = Math.floor(resto / 10);
            const decenasTexto = {
              3: "treinta",
              4: "cuarenta",
              5: "cincuenta",
              6: "sesenta",
              7: "setenta",
              8: "ochenta",
              9: "noventa",
            }[decenas];
  
            if (unidad === 0) {
              return `dos mil ${decenasTexto}`;
            } else {
              return `dos mil ${decenasTexto} y ${numerosPalabra[unidad]}`;
            }
          }
        }
  
        return año.toString();
      };
  
      const diaTexto = numerosPalabra[diaNum] || diaNum.toString();
      const mesTexto = meses[mesIndex];
      const añoTexto = convertirAño(añoNum);
  
      return `día ${diaTexto} del mes ${mesTexto} del año ${añoTexto}`;
    };


}
