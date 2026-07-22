"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Card, { CardData } from "./Card";
import styles from "./GameBoard.module.css";

type GameBoardProps = {
  cardDefinitions?: Omit<CardData, "uid">[];
  initialDeck?: Omit<CardData, "uid">[];
  backLink?: string;
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

export default function GameBoard({ cardDefinitions, initialDeck, backLink = "/", theme }: GameBoardProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number>(0);

  const initGame = useCallback(() => {
    let newDeck: CardData[] = [];
    if (initialDeck) {
      newDeck = shuffle(initialDeck.map((def, i) => ({ ...def, uid: i })));
    } else if (cardDefinitions) {
      newDeck = buildDeck(cardDefinitions);
    }
    setCards(newDeck);
    setFlipped([]);
    setMatched([]);
    setLockBoard(false);
    setElapsedMs(0);
    startRef.current = Date.now();
    setRunning(true);
  }, [cardDefinitions, initialDeck]);

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
      <div className={styles.timer} aria-live="off">
        ⏱ {formatTime(elapsedMs)}
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
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.overlayCard}>
            <h2 className={styles.clearTitle}>ゲームクリア！</h2>
            <p className={styles.clearText}>全8ペアを揃えました 🎉</p>
            <p className={styles.resultLabel}>クリアタイム</p>
            <p className={styles.resultTime}>{formatTime(elapsedMs)}</p>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.retryButton}
                onClick={initGame}
              >
                もう一度
              </button>
              <Link href={backLink} className={styles.quitButton}>
                やめる
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
