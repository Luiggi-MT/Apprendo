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


}
