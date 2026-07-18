// ======================================
// 定数定義
// ======================================
export const GameConstants = {
  // 各音の組数（ペア数）。×1 = 同じ音が2枚(=1組) ... という意味
  MULTIPLIERS: [1, 2, 3, 4],

  // 演出時間 (ミリ秒)
  CARD_FLIP_DELAY: 600,
} as const;

export type CardState = "hidden" | "flipped" | "matched";
export type Scene = "menu" | "game";

export interface Rhythm {
  name: string; // 一意な識別名
  label: string; // 表示用
  pattern: number[]; // 再生タイミング(秒)
}

// 8種類のリズムパターンを定義
export const ALL_RHYTHMS: Rhythm[] = [
  { name: "rhythm1", label: "リズム 1", pattern: [0, 0.25, 0.5, 0.75] },
  { name: "rhythm2", label: "リズム 2", pattern: [0, 0.5, 1.0] },
  { name: "rhythm3", label: "リズム 3", pattern: [0, 0.25, 0.75, 1.0] },
  { name: "rhythm4", label: "リズム 4", pattern: [0, 0.125, 0.25, 0.75] },
  { name: "rhythm5", label: "リズム 5", pattern: [0, 0.375, 0.75, 1.125] },
  { name: "rhythm6", label: "リズム 6", pattern: [0, 0.125, 0.375, 0.5] },
  { name: "rhythm7", label: "リズム 7", pattern: [0, 0.25, 0.375, 0.625] },
  { name: "rhythm8", label: "リズム 8", pattern: [0, 0.5, 0.625, 0.75] },
];

export const NAME_PATTERN: Record<string, number[]> = Object.fromEntries(
  ALL_RHYTHMS.map((r) => [r.name, r.pattern])
);

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

  playRhythm(pattern: number[]): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // ちょっとしたドラム/クリック音を複数回鳴らす
    pattern.forEach(delay => {
      const t = now + delay;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // パーカッシブな音を作る
      oscillator.frequency.setValueAtTime(150, t);
      oscillator.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(1, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

      oscillator.start(t);
      oscillator.stop(t + 0.1);
    });
  }
}
