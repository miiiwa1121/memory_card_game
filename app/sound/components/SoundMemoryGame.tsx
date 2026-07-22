"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AudioPlayer,
  BubbleLayout,
  buildAllNotes,
  CardState,
  computeBubbleLayout,
  createDeck,
  GameConstants,
  Scene,
} from "../lib/game";

const MULTIPLIERS = GameConstants.MULTIPLIERS;
const WHITE_PER_OCTAVE = GameConstants.WHITE_PER_OCTAVE;

// 鍵盤データ（モジュールロード時に一度だけ生成）
const ALL_NOTES = buildAllNotes();
const WHITE_NOTES = ALL_NOTES.filter((n) => !n.black);
const BLACK_NOTES = ALL_NOTES.filter((n) => n.black);
const NAME_FREQ: Record<string, number> = Object.fromEntries(
  ALL_NOTES.map((n) => [n.name, n.freq])
);

// デフォルト選択：ドレミファソラシド（白鍵の最初の8音）
const DEFAULT_SELECTED = WHITE_NOTES.slice(0, 8).map((n) => n.name);

// 黒鍵の配置（白鍵基準の％）。各オクターブで ド♯,レ♯,ファ♯,ソ♯,ラ♯ の順
const WHITE_W = 100 / WHITE_NOTES.length;
const BLACK_W = WHITE_W * 0.62;
const BLACK_KEYS: { note: (typeof BLACK_NOTES)[number]; left: number }[] = (() => {
  const keys: { note: (typeof BLACK_NOTES)[number]; left: number }[] = [];
  let bi = 0;
  for (let o = 0; o < GameConstants.MAX_OCTAVES; o++) {
    for (const gap of [0, 1, 3, 4, 5]) {
      const boundary = o * WHITE_PER_OCTAVE + gap;
      keys.push({
        note: BLACK_NOTES[bi++],
        left: (boundary + 1) * WHITE_W - BLACK_W / 2,
      });
    }
  }
  return keys;
})();

export default function SoundMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(DEFAULT_SELECTED)
  );
  const [multiplier, setMultiplier] = useState<number>(MULTIPLIERS[0]);

  // ゲーム進行中の状態
  const [deck, setDeck] = useState<string[]>([]);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [layout, setLayout] = useState<BubbleLayout | null>(null);

  // 音声・タイマー・周波数表
  const audioRef = useRef<AudioPlayer | null>(null);
  const freqRef = useRef<Record<string, number>>({});
  const waitingRef = useRef(false);
  const startTimeRef = useRef(0);

  // 鍵盤のなぞり操作用
  const selectedRef = useRef(selected);
  const dragRef = useRef(false);
  const modeRef = useRef<"add" | "remove">("add");

  useEffect(() => {
    if (audioRef.current === null) {
      audioRef.current = new AudioPlayer();
    }
    selectedRef.current = selected;
  }, [selected]);

  const getElapsed = useCallback(() => {
    return (Date.now() - startTimeRef.current) / 1000;
  }, []);

  const noteCount = selected.size;
  const totalCards = noteCount * 2 * multiplier;

  // ===== 鍵盤のなぞり選択 =====
  const applyKey = useCallback((name: string, mode: "add" | "remove") => {
    const cur = selectedRef.current;
    const has = cur.has(name);
    if (mode === "add" && !has) {
      const next = new Set(cur);
      next.add(name);
      selectedRef.current = next;
      setSelected(next);
      audioRef.current?.playTone(NAME_FREQ[name]);
    } else if (mode === "remove" && has) {
      const next = new Set(cur);
      next.delete(name);
      selectedRef.current = next;
      setSelected(next);
    }
  }, []);

  const keyAt = (x: number, y: number): string | null => {
    const el = document.elementFromPoint(x, y);
    const key = el?.closest<HTMLElement>("[data-key]");
    return key?.dataset.key ?? null;
  };

  const onKeyboardDown = (e: React.PointerEvent) => {
    const name = keyAt(e.clientX, e.clientY);
    if (name === null) return;
    dragRef.current = true;
    modeRef.current = selectedRef.current.has(name) ? "remove" : "add";
    applyKey(name, modeRef.current);
  };

  const onKeyboardMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const name = keyAt(e.clientX, e.clientY);
    if (name !== null) applyKey(name, modeRef.current);
  };

  useEffect(() => {
    const end = () => {
      dragRef.current = false;
    };
    window.addEventListener("pointerup", end);
    return () => window.removeEventListener("pointerup", end);
  }, []);

  // ===== ゲーム開始 =====
  const startGame = useCallback(() => {
    if (selected.size === 0) return;
    const names = [...selected];
    freqRef.current = Object.fromEntries(names.map((n) => [n, NAME_FREQ[n]]));
    const newDeck = createDeck(names, multiplier);

    setDeck(newDeck);
    setCardStates(new Array(newDeck.length).fill("hidden"));
    setSelectedCards([]);
    setMatchesFound(0);
    setElapsed(0);
    setCleared(false);
    setLayout(
      computeBubbleLayout(newDeck.length, window.innerWidth, window.innerHeight)
    );
    waitingRef.current = false;
    startTimeRef.current = Date.now();
    setScene("game");
  }, [selected, multiplier]);

  const totalPairs = Math.floor(deck.length / 2);

  // タイマー（スタートと同時にカウント、クリアで停止）
  useEffect(() => {
    if (scene !== "game" || cleared) return;
    const interval = setInterval(() => setElapsed(getElapsed()), 100);
    return () => clearInterval(interval);
  }, [scene, cleared, getElapsed]);

  // クリア判定
  useEffect(() => {
    if (
      scene === "game" &&
      !cleared &&
      totalPairs > 0 &&
      matchesFound === totalPairs
    ) {
      setElapsed(getElapsed());
      setCleared(true);
    }
  }, [scene, cleared, matchesFound, totalPairs, getElapsed]);

  // ===== カード（バブル）操作：常に2枚で判定 =====
  const handleCardClick = useCallback(
    (index: number) => {
      if (waitingRef.current || cleared) return;
      if (selectedCards.length >= 2) return;
      if (cardStates[index] !== "hidden") return;

      audioRef.current?.playTone(freqRef.current[deck[index]]);

      const nextStates = [...cardStates];
      nextStates[index] = "flipped";
      const nextSelected = [...selectedCards, index];
      setCardStates(nextStates);
      setSelectedCards(nextSelected);

      if (nextSelected.length === 2) {
        waitingRef.current = true;
        const [idx1, idx2] = nextSelected;
        const isMatch = deck[idx1] === deck[idx2];

        setTimeout(() => {
          setCardStates((prev) => {
            const updated = [...prev];
            updated[idx1] = isMatch ? "matched" : "hidden";
            updated[idx2] = isMatch ? "matched" : "hidden";
            return updated;
          });
          if (isMatch) setMatchesFound((m) => m + 1);
          setSelectedCards([]);
          waitingRef.current = false;
        }, GameConstants.CARD_FLIP_DELAY);
      }
    },
    [cleared, selectedCards, cardStates, deck]
  );

  const quitToMenu = useCallback(() => {
    setCleared(false);
    setScene("menu");
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "64px" }}>
      
      {/* メニュー画面 */}
      <div className={`screen ${scene === "menu" ? "active" : ""}`} id="menu-screen">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ marginBottom: "12px", fontSize: "2.4rem" }}>音階神経衰弱</h1>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            カードをめくってピアノの音を聴き分け、<br />同じ音程のペアを揃えよう！
          </p>
        </div>
        <div className="menu-buttons">
          <p className="menu-label">音の種類（鍵盤をなぞって選択）</p>
          <div
            className="piano"
            onPointerDown={onKeyboardDown}
            onPointerMove={onKeyboardMove}
          >
            {WHITE_NOTES.map((n, i) => (
              <div
                key={n.name}
                data-key={n.name}
                role="button"
                aria-pressed={selected.has(n.name)}
                aria-label={n.name}
                className={`piano-key ${selected.has(n.name) ? "selected" : ""} ${
                  i !== 0 && i % WHITE_PER_OCTAVE === 0 ? "octave-start" : ""
                }`}
              >
                <span className="piano-key-label">{n.label}</span>
              </div>
            ))}
            {BLACK_KEYS.map((b) => (
              <div
                key={b.note.name}
                data-key={b.note.name}
                role="button"
                aria-pressed={selected.has(b.note.name)}
                aria-label={b.note.name}
                className={`piano-black ${
                  selected.has(b.note.name) ? "selected" : ""
                }`}
                style={{ left: `${b.left}%`, width: `${BLACK_W}%` }}
              />
            ))}
          </div>

          <p className="menu-label">各音の組数</p>
          <div className="option-row">
            {MULTIPLIERS.map((m) => (
              <button
                key={m}
                className={`option-button ${m === multiplier ? "selected" : ""}`}
                onClick={() => setMultiplier(m)}
              >
                ×{m}
                <span className="option-sub">
                  {m}組 / {m * 2}枚
                </span>
              </button>
            ))}
          </div>

          <p className="menu-total">
            合計 <strong>{totalCards}</strong> 枚
            <span className="menu-total-sub">
              （{noteCount}音 × {multiplier}組 × 2）
            </span>
          </p>

          <button
            className="start-button"
            onClick={startGame}
            disabled={noteCount === 0}
          >
            開始
          </button>
        </div>
      </div>

      {/* ゲーム紹介（スクロール先） */}
      {scene === "menu" && (
        <div style={{
          background: "var(--surface)",
          padding: "48px 40px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          backdropFilter: "blur(22px)",
          maxWidth: "800px",
          width: "100%",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "var(--text)" }}>ゲーム紹介</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
            ※ここにゲームの詳しいルールや紹介文が入ります。
          </p>
        </div>
      )}

      {/* ゲーム画面 */}
      <div className={`screen ${scene === "game" ? "active" : ""}`} id="game-screen">
        <div className="game-header">
          <div className="game-info">
            <span>
              そろえた: {matchesFound}/{totalPairs}
            </span>
            <span>タイム: {elapsed.toFixed(1)}秒</span>
          </div>
          <div className="game-controls">
            <button className="quit-button quit-button--header" onClick={quitToMenu}>
              やめる
            </button>
          </div>
        </div>

        {layout && (
          <div
            className="bubble-field"
            style={{ width: layout.width, height: layout.height }}
          >
            {deck.map((note, i) => {
              const state = cardStates[i] ?? "hidden";
              const pos = layout.positions[i];
              const d = layout.diameter;
              return (
                <button
                  key={i}
                  type="button"
                  className={`bubble ${state !== "hidden" ? state : ""}`}
                  onClick={() => handleCardClick(i)}
                  aria-label={state === "matched" ? `${note} 成立` : "シャボン玉"}
                  style={{
                    width: d,
                    height: d,
                    left: pos.x - d / 2,
                    top: pos.y - d / 2,
                  }}
                >
                  <span className="bubble-face">
                    {state === "matched" ? (
                      <span className="bubble-note">{note}</span>
                    ) : state === "flipped" ? (
                      <span className="bubble-wave" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      <span className="bubble-icon" aria-hidden="true">
                        ♪
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* リザルト（画面遷移せずオーバーレイ表示） */}
        {cleared && (
          <div className="result-overlay" role="dialog" aria-modal="true">
            <div className="result-card">
              <p className="result-eyebrow">CLEAR!</p>
              <h2 className="result-title">クリア！おめでとう！</h2>
              <p className="result-time">
                クリアタイム <strong>{elapsed.toFixed(1)}</strong> 秒
              </p>
              <div className="result-buttons">
                <button className="start-button" onClick={startGame}>
                  もう一度
                </button>
                <button className="quit-button" onClick={quitToMenu}>
                  やめる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
      
      </div>
  );
}
