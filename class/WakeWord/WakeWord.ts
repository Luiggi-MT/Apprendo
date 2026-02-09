import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

type CommandCallback = (command: string) => void;

class WakeWord {
  private static instance: WakeWord;

  private listeningWake = false;
  private listeningCommand = false;

  private wakeWords = ["Sofía", "hola sofía", "ok sofía", "sofía"];
  private commandResolve: ((cmd: string) => void) | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  private constructor() {
    this.setupListeners();
  }

  static getInstance(): WakeWord {
    if (!WakeWord.instance) {
      WakeWord.instance = new WakeWord();
    }
    return WakeWord.instance;
  }

  private setupListeners() {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const text = e.value?.[0]?.toLowerCase();
      if (!text) return;

      console.log("🎤 Voice:", text);

      // 🔔 WAKE WORD
      if (this.listeningWake) {
        if (this.wakeWords.some(w => text.includes(w))) {
          console.log("🔔 WakeWord detectado");
          this.stop();
          this.listeningWake = false;
          this.onWakeDetected?.();
        }
        return;
      }

      // 🎯 COMANDO
      if (this.listeningCommand && this.commandResolve) {
        this.commandResolve(text);
        this.cleanupCommand();
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.warn("Voice error:", e.error);
      this.cleanupCommand();
    };
  }

  // ================= WAKE =================

  private onWakeDetected?: () => void;

  async startWake(onWake: () => void) {
    this.onWakeDetected = onWake;
    this.listeningWake = true;
    await this.restartVoice();
    console.log("👂 WakeWord escuchando");
  }

  // ================= COMANDO =================

  async listenCommand(timeout = 7000): Promise<string> {
    this.listeningCommand = true;

    return new Promise(async (resolve, reject) => {
      this.commandResolve = resolve;

      this.timeoutId = setTimeout(() => {
        reject(new Error("Timeout comando"));
        this.cleanupCommand();
      }, timeout);

      await this.restartVoice();
      console.log("🎯 Escuchando comando");
    });
  }

  // ================= CONTROL =================

  private async restartVoice() {
    try {
      await Voice.stop();
      await Voice.start("es-ES", { EXTRA_PARTIAL_RESULTS: false });
    } catch {}
  }

  private async stop() {
    await Voice.stop();
  }

  private cleanupCommand() {
    this.listeningCommand = false;
    this.commandResolve = null;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.stop();
  }
}

export default WakeWord.getInstance();
