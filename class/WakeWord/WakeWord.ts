import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

class WakeWord {
  private static instance: WakeWord;
  private resultSubscription: any = null;
  private errorSubscription: any = null;
  private endSubscription: any = null;

  private listeningWake = false;
  private listeningCommand = false;
  private wasListening = false;

  private wakeWords = ['Sofía', 'hola sofía', 'ok sofía', 'sofía'];
  private commandResolve: ((cmd: string) => void) | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private onWakeDetected?: () => void;

  // Control de concurrencia
  private stopPromise: Promise<void> | null = null;
  private startPromise: Promise<void> | null = null;
  private _isStopping = false;
  private _isRecognizing = false;
  private permissionDenied = false;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): WakeWord {
    if (!WakeWord.instance) {
      WakeWord.instance = new WakeWord();
    }
    return WakeWord.instance;
  }

  private setupListeners() {
    // Setup listeners para expo-speech-recognition
    this.resultSubscription = ExpoSpeechRecognitionModule.addListener(
      'result',
      (event) => {
        const text = event?.results?.[0]?.transcript?.toLowerCase();
        if (!text) return;

        if (this.listeningWake) {
          if (this.wakeWords.some(w => text.includes(w))) {
            this.stopListening();
            this.listeningWake = false;
            this.onWakeDetected?.();
          }
          return;
        }

        if (this.listeningCommand && this.commandResolve) {
          this.commandResolve(text);
          this.cleanupCommand();
        }
      }
    );

    this.errorSubscription = ExpoSpeechRecognitionModule.addListener(
      'error',
      (event) => {
        const errorCode = event?.error;
        this._isRecognizing = false;
        if (errorCode === 'no-speech') {
          // Normal: nadie habló. Si estamos en modo wake, reiniciamos silenciosamente.
          if (this.listeningWake && this.onWakeDetected) {
            this.restartVoice();
          }
          return;
        }
        console.warn('Voice error:', errorCode);
        this.cleanupCommand();
      }
    );

    this.endSubscription = ExpoSpeechRecognitionModule.addListener(
      'end',
      () => {
        this._isRecognizing = false;
      }
    );
  }

  /**
   * Inicia la escucha de la palabra de activación.
   * @param onWake Callback a ejecutar cuando se detecta la palabra.
   */
  public async startWake(onWake: () => void) {
    if (!this.resultSubscription || !this.errorSubscription || !this.endSubscription) {
      this.setupListeners();
    }
    this.onWakeDetected = onWake;
    this.listeningWake = true;
    await this.restartVoice();
  }

  /**
   * Escucha un comando después de la activación.
   * @param timeout Tiempo máximo de espera en ms.
   * @returns Promesa con el comando detectado.
   */
  public async listenCommand(timeout = 7000): Promise<string> {
    this.listeningCommand = true;

    return new Promise(async (resolve, reject) => {
      this.commandResolve = resolve;
      this.timeoutId = setTimeout(() => {
        reject(new Error('Timeout comando'));
        this.cleanupCommand();
      }, timeout);

      await this.restartVoice();
    });
  }

  /**
   * Detiene la escucha actual (tanto wake como command) sin reiniciar.
   */
  private async stopListening() {
    // Evita múltiples llamadas simultáneas a stop
    if (this.stopPromise) {
      return this.stopPromise;
    }

    this.stopPromise = (async () => {
      this._isStopping = true;
      try {
        await ExpoSpeechRecognitionModule.stop();
      } catch (error) {
        // Ignorar errores (por ejemplo, si ya estaba detenido)
      } finally {
        this._isRecognizing = false;
        this._isStopping = false;
        this.stopPromise = null;
      }
    })();

    return this.stopPromise;
  }

  /**
   * Reinicia el reconocimiento: detiene cualquier escucha previa y vuelve a iniciar.
   */
  private async restartVoice() {
    // Si ya hay un inicio en curso, esperamos a que termine
    if (this.startPromise) {
      return this.startPromise;
    }

    // Si ya está escuchando, no reiniciamos
    if (this._isRecognizing) {
      return;
    }

    this.startPromise = (async () => {
      // Esperar a que cualquier stop pendiente termine
      if (this.stopPromise) {
        await this.stopPromise;
      }

      // También podemos esperar a que _isStopping sea false por si acaso
      while (this._isStopping) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      try {
        // Si el usuario ya denegó permisos, no volver a preguntar
        if (this.permissionDenied) {
          return;
        }

        // Solicitar permisos antes de iniciar
        const { granted } =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!granted) {
          this.permissionDenied = true;
          this.listeningWake = false;
          this.listeningCommand = false;
          this.onWakeDetected = undefined;
          return;
        }

        await ExpoSpeechRecognitionModule.start({
          lang: 'es-ES',
          maxAlternatives: 1,
          interimResults: false,
        });
        this._isRecognizing = true;
      } catch (error) {
        console.warn('Error al iniciar voz:', error);
      } finally {
        this.startPromise = null;
      }
    })();

    return this.startPromise;
  }

  /**
   * Detiene temporalmente la escucha (modo pausa).
   * Guarda el estado anterior para poder reanudar después.
   */
  public async pauseListening() {
    this.wasListening = this.listeningWake || this.listeningCommand;

    if (this.wasListening) {
      this.listeningWake = false;
      this.listeningCommand = false;

      // Limpiar cualquier timeout de comando pendiente
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      // No resolver la promesa de comando pendiente (se ignorará)
      this.commandResolve = null;

      // IMPORTANTE: No limpiar onWakeDetected aquí, porque lo necesitamos en resumeListening
      // Solo lo limpiaremos cuando se registre un nuevo callback

      await this.stopListening();
    }
  }

  /**
   * Reanuda la escucha si estaba pausada.
   * Vuelve al modo anterior (wake o command) según corresponda.
   */
  public async resumeListening() {
    if (this.wasListening) {
      this.wasListening = false;

      if (this.onWakeDetected) {
        this.listeningWake = true;
        await this.restartVoice();
      } else if (this.commandResolve) {
        this.listeningCommand = true;
        await this.restartVoice();
      }
      // Si no hay callback, simplemente no hacemos nada (no reiniciamos)
    }
  }

  /**
   * Detiene completamente la escucha y limpia el callback.
   * Útil para cuando sales completamente de una característica de voz.
   */
  public async stopWake() {
    this.listeningWake = false;
    this.onWakeDetected = undefined;
    await this.stopListening();
  }

  /**
   * Limpia el estado después de recibir un comando o un error.
   */
  private cleanupCommand() {
    this.listeningCommand = false;
    this.commandResolve = null;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // No detenemos la voz aquí, porque quizás queremos seguir escuchando wake word
    // Si estábamos en modo comando, pasamos de nuevo a modo wake si corresponde
    if (this.onWakeDetected) {
      this.listeningWake = true;
      this.restartVoice(); // no await intencionalmente, se ejecuta en background
    } else {
      // Si no hay wake, paramos
      this.stopListening();
    }
  }
}

export default WakeWord.getInstance();