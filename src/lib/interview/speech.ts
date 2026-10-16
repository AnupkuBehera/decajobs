/**
 * Web Speech API Utilities (Speech-to-Text and Text-to-Speech)
 *
 * Provides high-fidelity, client-side voice interaction without third-party
 * paid API costs or backend latency.
 */

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

export interface SpeechRecognizerHandlers {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStateChange?: (isListening: boolean) => void;
}

export class BrowserSpeechRecognizer {
  private recognition: any = null;
  private isListening = false;
  private handlers: SpeechRecognizerHandlers;

  constructor(handlers: SpeechRecognizerHandlers) {
    this.handlers = handlers;

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";

        this.recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const combined = (finalTranscript || interimTranscript).trim();
          if (combined) {
            this.handlers.onTranscript(combined, Boolean(finalTranscript));
          }
        };

        this.recognition.onerror = (event: any) => {
          if (event.error !== "no-speech") {
            this.handlers.onError?.(event.error);
          }
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            // Auto-restart if user hasn't explicitly stopped listening
            try {
              this.recognition.start();
            } catch {
              this.isListening = false;
              this.handlers.onStateChange?.(false);
            }
          } else {
            this.handlers.onStateChange?.(false);
          }
        };
      }
    }
  }

  public start() {
    if (!this.recognition) {
      this.handlers.onError?.("Speech recognition is not supported in this browser.");
      return;
    }
    try {
      this.isListening = true;
      this.recognition.start();
      this.handlers.onStateChange?.(true);
    } catch {
      // Already running
    }
  }

  public stop() {
    if (!this.recognition) return;
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch {
      // Ignored
    }
    this.handlers.onStateChange?.(false);
  }

  public getListeningState() {
    return this.isListening;
  }
}

/**
 * Text to Speech Voice Synthesizer
 */
export function speakText(
  text: string,
  options: {
    pitch?: number;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options.onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.lang = "en-US";

  // Select natural sounding voice if available
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") ||
        v.name.includes("Samantha") ||
        v.name.includes("Natural") ||
        v.name.includes("Zira"))
  );
  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = () => options.onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
