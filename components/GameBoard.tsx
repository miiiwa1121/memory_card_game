"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Card, { CardData } from "./Card";
import styles from "./GameBoard.module.css";

type GameBoardProps = {
  cardDefinitions?: Omit<CardData, "uid">[];
  initialDeck?: Omit<CardData, "uid">[];
  backLink?: string;
  onQuit?: () => void;
  theme?: "vegetable" | "color" | "language" | "morse" | "knowledge";
};

function buildDeck(definitions: Omit<CardData, "uid">[]): CardData[] {
  const deck: CardData[] = [];
  definitions.forEach((def) => {
    deck.push({ uid: deck.length, ...def });
    deck.push({ uid: deck.length, ...def });
  });
  return shuffle(deck);
}

function shuffle(cards: CardData[]): CardData[] {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map((card, index) => ({ ...card, uid: index }));
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function GameBoard({ cardDefinitions, initialDeck, backLink = "/", onQuit, theme }: GameBoardProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number>(0);

  // 依存配列による再レンダリング防止のため参照を保持
  const defsRef = useRef(cardDefinitions);
  defsRef.current = cardDefinitions;
  const initialDeckRef = useRef(initialDeck);
  initialDeckRef.current = initialDeck;

  const initGame = useCallback(() => {
    let newDeck: CardData[] = [];
    const iDeck = initialDeckRef.current;
    const defs = defsRef.current;
    
    if (iDeck) {
      newDeck = shuffle(iDeck.map((def, i) => ({ ...def, uid: i })));
    } else if (defs) {
      newDeck = buildDeck(defs);
    }
    setCards(newDeck);
    setFlipped([]);
    setMatched([]);
    setLockBoard(false);
    setElapsedMs(0);
    startRef.current = Date.now();
    setRunning(true);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [running]);

  const isCleared = cards.length > 0 && matched.length === cards.length / 2;

  useEffect(() => {
    if (isCleared) {
      setRunning(false);
      setElapsedMs(Date.now() - startRef.current);
    }
  }, [isCleared]);

  const handleClick = useCallback(
    (uid: number) => {
      if (lockBoard) return;
      // 既にめくっている / 一致済みのカードは無視
      if (flipped.includes(uid)) return;
      const card = cards.find((c) => c.uid === uid);
      if (!card || matched.includes(card.id)) return;
      if (flipped.length >= 2) return;

      const nextFlipped = [...flipped, uid];
      setFlipped(nextFlipped);

      if (nextFlipped.length === 2) {
        setLockBoard(true);
        const [firstUid, secondUid] = nextFlipped;
        const first = cards.find((c) => c.uid === firstUid)!;
        const second = cards.find((c) => c.uid === secondUid)!;

        if (first.id === second.id) {
          // 一致
          setMatched((prev) => [...prev, first.id]);
          setFlipped([]);
          setLockBoard(false);
        } else {
          // 不一致: 1秒後に裏返す
          setTimeout(() => {
            setFlipped([]);
            setLockBoard(false);
          }, 1000);
        }
      }
    },
    [cards, flipped, matched, lockBoard]
  );

  return (
    <div className={`${styles.wrapper} ${theme ? `theme-${theme}` : ""}`}>
      <div className="game-header">
        <div className="game-info">
          <span>⏱ {formatTime(elapsedMs)}</span>
        </div>
        <div className="game-controls">
          {onQuit ? (
            <button onClick={onQuit} className="quit-button--header" style={{ textDecoration: "none" }}>
              やめる
            </button>
          ) : (
            <Link href={backLink} className="quit-button--header" style={{ textDecoration: "none" }}>
              やめる
            </Link>
          )}
        </div>
      </div>

      <div className={styles.board}>
        {cards.map((card) => (
          <Card
            key={card.uid}
            card={card}
            flipped={flipped.includes(card.uid)}
            matched={matched.includes(card.id)}
            onClick={handleClick}
          />
        ))}
      </div>

      {isCleared && (
        <div className="result-overlay" role="dialog" aria-modal="true">
          <div className="result-card">
            <h2 className="result-title">ゲームクリア！</h2>
            <p className="result-eyebrow">全ペアを揃えました 🎉</p>
            <p className="result-time">
              クリアタイム<br />
              <strong>{formatTime(elapsedMs)}</strong>
            </p>
            <div className="result-buttons">
              <button
                type="button"
                className="start-button"
                onClick={initGame}
              >
                もう一度
              </button>
              {onQuit ? (
                <button onClick={onQuit} className="quit-button" style={{ display: "block", textAlign: "center", textDecoration: "none", width: "100%" }}>
                  やめる
                </button>
              ) : (
                <Link href={backLink} className="quit-button" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                  やめる
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
