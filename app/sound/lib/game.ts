// ======================================
// 定数定義
// ======================================
export const GameConstants = {
  // 鍵盤 / 1オクターブ = 12音（白7 + 黒5）、最大3オクターブ
  WHITE_PER_OCTAVE: 7,
  MAX_OCTAVES: 3,

  // 各音の組数（ペア数）。×1 = 同じ音が2枚(=1組) ... という意味
  MULTIPLIERS: [1, 2, 3, 4],

  // 音設定
  TONE_DURATION: 0.3,
  TONE_AMPLITUDE: 0.3,

  // 演出時間 (ミリ秒)
  CARD_FLIP_DELAY: 600,
} as const;

// 1オクターブ分の半音階（C4 起点）。black=黒鍵(♯)
const BASE_NOTES: { label: string; freq: number; black: boolean }[] = [
  { label: "ド", freq: 261.63, black: false },
  { label: "ド♯", freq: 277.18, black: true },
  { label: "レ", freq: 293.66, black: false },
  { label: "レ♯", freq: 311.13, black: true },
  { label: "ミ", freq: 329.63, black: false },
  { label: "ファ", freq: 349.23, black: false },
  { label: "ファ♯", freq: 369.99, black: true },
  { label: "ソ", freq: 392.0, black: false },
  { label: "ソ♯", freq: 415.3, black: true },
  { label: "ラ", freq: 440.0, black: false },
  { label: "ラ♯", freq: 466.16, black: true },
  { label: "シ", freq: 493.88, black: false },
];

// オクターブを表す記号（例: ド / ド′ / ド″）
const OCTAVE_SYMBOL = ["", "′", "″"];

export type CardState = "hidden" | "flipped" | "matched";
export type Scene = "menu" | "game";

export interface Note {
  name: string; // 一意な識別名／カード表示（例: "ド′", "ド♯"）
  label: string; // 鍵盤表示用（例: "ド", "ド♯"）
  octave: number; // 1〜
  freq: number;
  black: boolean; // 黒鍵かどうか
}

// 鍵盤全体（3オクターブ = 36音）を半音階順で生成
export function buildAllNotes(): Note[] {
  const notes: Note[] = [];
  for (let o = 0; o < GameConstants.MAX_OCTAVES; o++) {
    const symbol = OCTAVE_SYMBOL[o] ?? "′".repeat(o);
    for (const base of BASE_NOTES) {
      notes.push({
        name: `${base.label}${symbol}`,
        label: base.label,
        octave: o + 1,
        freq: base.freq * 2 ** o,
        black: base.black,
      });
    }
  }
  return notes;
}

// 各音を「pairsPerNote 組 = pairsPerNote×2 枚」並べてシャッフル
export function createDeck(noteNames: string[], pairsPerNote: number): string[] {
  const copies = pairsPerNote * 2;
  const deck: string[] = [];
  for (const name of noteNames) {
    for (let i = 0; i < copies; i++) deck.push(name);
  }

  // Fisher-Yates シャッフル
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// ======================================
// シャボン玉のランダム配置
// ======================================
export interface BubbleLayout {
  width: number;
  height: number;
  diameter: number;
  positions: { x: number; y: number }[]; // 各バブルの中心座標(px)
}

export function computeBubbleLayout(
  count: number,
  viewportW: number,
  viewportH: number
): BubbleLayout {
  const width = Math.min(viewportW * 0.9, 1040);
  const height = Math.max(360, Math.min(viewportH * 0.62, 720));

  // 枚数に応じてバブル径を決定（多いほど小さく）
  const packing = count > 40 ? 0.32 : 0.4;
  let diameter = Math.sqrt((packing * width * height) / count);
  diameter = Math.max(34, Math.min(diameter, 96));

  const positions: { x: number; y: number }[] = [];
  const minDist = diameter * 0.98;
  const r = diameter / 2;

  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let attempt = 0; attempt < 500 && !placed; attempt++) {
      const x = r + Math.random() * (width - diameter);
      const y = r + Math.random() * (height - diameter);
      if (positions.every((p) => Math.hypot(p.x - x, p.y - y) >= minDist)) {
        positions.push({ x, y });
        placed = true;
      }
    }
    // 配置できなければ多少の重なりを許容
    if (!placed) {
      positions.push({
        x: r + Math.random() * (width - diameter),
        y: r + Math.random() * (height - diameter),
      });
    }
  }

  return { width, height, diameter, positions };
}

// ======================================
// 音声再生クラス (Web Audio API)
// ======================================
export class AudioPlayer {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioContext) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.audioContext = new Ctor();
      } catch (e) {
        console.warn("Web Audio API not supported", e);
        return null;
      }
    }
    // ユーザー操作後に再開（自動再生ポリシー対策）
    if (this.audioContext.state === "suspended") {
      void this.audioContext.resume();
    }
    return this.audioContext;
  }

  playTone(frequency: number, duration = GameConstants.TONE_DURATION): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(GameConstants.TONE_AMPLITUDE, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }
}
