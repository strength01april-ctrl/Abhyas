import { storage } from './storage';

/**
 * Subtle UI sounds using the Web Audio API.
 * No external assets, no background music.
 * All sounds are short, soft tones — never harsh buzzers.
 */

let ctx: AudioContext | null = null;
let enabled: boolean | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function isSoundEnabled(): boolean {
  if (enabled === null) enabled = storage.loadSoundPreference();
  return enabled;
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  storage.saveSoundPreference(on);
}

interface ToneOptions {
  frequency: number;
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  /** Delay before the tone starts, in seconds. */
  delay?: number;
  /** Optional slide-to frequency for a gentle glide. */
  slideTo?: number;
}

function tone({ frequency, duration = 0.18, type = 'sine', volume = 0.12, delay = 0, slideTo }: ToneOptions): void {
  if (!isSoundEnabled()) return;
  const ac = audioCtx();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  if (slideTo) {
    osc.frequency.linearRampToValueAtTime(slideTo, start + duration);
  }
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sound = {
  subjectSelect() {
    tone({ frequency: 523.25, duration: 0.16, type: 'sine', volume: 0.1 });
  },
  activitySelect() {
    tone({ frequency: 659.25, duration: 0.16, type: 'sine', volume: 0.1 });
  },
  startSession() {
    tone({ frequency: 392, duration: 0.18, volume: 0.1 });
    tone({ frequency: 587.33, duration: 0.22, volume: 0.1, delay: 0.12 });
  },
  submit() {
    tone({ frequency: 440, duration: 0.14, type: 'triangle', volume: 0.09 });
  },
  complete() {
    tone({ frequency: 523.25, duration: 0.18, volume: 0.1 });
    tone({ frequency: 659.25, duration: 0.18, volume: 0.1, delay: 0.1 });
    tone({ frequency: 783.99, duration: 0.28, volume: 0.1, delay: 0.2 });
  },
  /** Soft neutral tone for incorrect answers — never a harsh buzzer. */
  incorrect() {
    tone({ frequency: 311.13, duration: 0.2, type: 'sine', volume: 0.06 });
  },
  /** Warm applause-style cluster for scores 80%+. */
  applause() {
    if (!isSoundEnabled()) return;
    const ac = audioCtx();
    if (!ac) return;
    // Filtered noise burst to emulate clapping.
    const duration = 1.8;
    const bufferSize = Math.floor(ac.sampleRate * duration);
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // amplitude envelope: quick attack, gradual decay
      const t = i / bufferSize;
      const env = Math.exp(-t * 2.2) * (0.5 + 0.5 * Math.sin(t * 60));
      data[i] = (Math.random() * 2 - 1) * env * 0.5;
    }
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.8;
    const gain = ac.createGain();
    gain.gain.value = 0.18;
    src.connect(filter).connect(gain).connect(ac.destination);
    src.start();
  },
  toggle(on: boolean) {
    enabled = on;
    storage.saveSoundPreference(on);
    if (on) {
      tone({ frequency: 660, duration: 0.12, volume: 0.08 });
    }
  },
};
