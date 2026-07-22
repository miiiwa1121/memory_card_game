"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AudioPlayer,
  BubbleLayout,
  CardState,
  computeBubbleLayout,
  createDeck,
  GameConstants,
  Scene,
  ALL_RHYTHMS,
  NAME_PATTERN,
} from "../lib/game";
import GameLayout from "@/components/GameLayout";

const MULTIPLIERS = GameConstants.MULTIPLIERS;

export default function RhythmMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");
  const [multiplier, setMultiplier] = useState<number>(MULTIPLIERS[0]);

  // ゲーム進行中の状態
  const [deck, setDeck] = useState<string[]>([]);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [layout, setLayout] = useState<BubbleLayout | null>(null);

  // 音声・タイマー・パターン表
  const audioRef = useRef<AudioPlayer | null>(null);
  const waitingRef = useRef(false);
  const startTimeRef = useRef(0);

  if (audioRef.current === null && typeof window !== "undefined") {
    audioRef.current = new AudioPlayer();
  }

  const getElapsed = useCallback(() => {
    return (Date.now() - startTimeRef.current) / 1000;
  }, []);

  const totalCards = ALL_RHYTHMS.length * 2 * multiplier;

  // ===== ゲーム開始 =====
  const startGame = useCallback(() => {
    const names = ALL_RHYTHMS.map(r => r.name);
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
  }, [multiplier]);

  const totalPairs = Math.floor(deck.length / 2);

  // タイマー
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

      audioRef.current?.playRhythm(NAME_PATTERN[deck[index]]);

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
    <GameLayout
      scene={scene}
      themeVars={{
        "--accent": "#818cf8",
        "--accent-2": "#c084fc",
        "--pink": "#f472b6",
        "--grad-accent": "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)"
      } as React.CSSProperties}
      title="リズム感神経衰弱"
      description={
        <>
          カードをめくってドラムのリズムを聴き分け、<br />同じパターンのペアを揃えよう！
        </>
      }
      introContent={<p>※ここにゲームの詳しいルールや紹介文が入ります。</p>}
      menuControls={
        <>
          <p className="menu-label">各リズムの組数</p>
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
              （8種類 × {multiplier}組 × 2）
            </span>
          </p>

          <button
            className="start-button"
            onClick={startGame}
          >
            開始
          </button>
        </>
      }
    >
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
            {deck.map((rhythmName, i) => {
              const state = cardStates[i] ?? "hidden";
              const pos = layout.positions[i];
              const d = layout.diameter;
              return (
                <button
                  key={i}
                  type="button"
                  className={`bubble ${state !== "hidden" ? state : ""}`}
                  onClick={() => handleCardClick(i)}
                  aria-label={state === "matched" ? `リズム成立` : "シャボン玉"}
                  style={{
                    width: d,
                    height: d,
                    left: pos.x - d / 2,
                    top: pos.y - d / 2,
                  }}
                >
                  <span className="bubble-face">
                    {state === "matched" ? (
                      <span className="bubble-note">★</span>
                    ) : state === "flipped" ? (
                      <span className="bubble-wave" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      <span className="bubble-icon" aria-hidden="true">
                        🥁
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* リザルト */}
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
    </GameLayout>
  );
}
