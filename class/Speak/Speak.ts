import * as Speech from "expo-speech";

export class Speak {
  private static instance: Speak;
  private isSpeaking = false;

  private constructor() {}

  static getInstance(): Speak {
    if (!Speak.instance) {
      Speak.instance = new Speak();
    }
    return Speak.instance;
  }

  hablar(texto: string): Promise<void> {
    return new Promise((resolve) => {
      this.isSpeaking = true;

      Speech.speak(texto, {
        language: "es",
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

  detener() {
    Speech.stop();
    this.isSpeaking = false;
  }

  estaHablando(): boolean {
    return this.isSpeaking;
  }
}
