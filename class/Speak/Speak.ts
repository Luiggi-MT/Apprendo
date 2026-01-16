import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { ConnectApi } from "../Connect.Api/ConnectApi";

export class Speak {
  private recording: Audio.Recording | null = null;
  private api: ConnectApi;

  constructor() {
    this.api = new ConnectApi();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async startRecording() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      android: {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
        isMeteringEnabled: true,
      }as any,
      ios: {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
        isMeteringEnabled: true,
      }as any,
    });

    await recording.startAsync();
    this.recording = recording;
  }

  private async waitForSilence(
    threshold = -40,    // dB
    silenceMs = 500     // ms
  ) {
    if (!this.recording) return;

    let silenceStart = Date.now();

    while (true) {
      const status = await this.recording.getStatusAsync();
      const level = status.metering ?? -100;

      if (level < threshold) {
        if (Date.now() - silenceStart >= silenceMs) break;
      } else {
        silenceStart = Date.now();
      }

      await this.delay(100);
    }
  }

  private async stopRecording(): Promise<string | null> {
    if (!this.recording) return null;

    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI();
    this.recording = null;

    return uri;
  }

  public async hablar(texto: string, onDone?: () => void) {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    Speech.speak(texto, {
      language: "es-ES",
      rate: 0.9,
      pitch: 1.0,
      onDone,
    });
  }

  public detenerAsistente() {
    Speech.stop();
  }

  public async procesarComandoVoz(): Promise<string | null> {
    await this.startRecording();
    await this.waitForSilence();

    const uri = await this.stopRecording();
    if (!uri) return null;

    return await this.api.enviarAudio(uri);
  }
}
