"use client";

import Image from "next/image";
import styles from "./Card.module.css";

export type CardData = {
  uid: number;
  id: string;
  file?: string;
  hex?: string;
  text?: string;
  name?: string;
};

type CardProps = {
  card: CardData;
  flipped: boolean;
  matched: boolean;
  onClick: (uid: number) => void;
};

export default function Card({ card, flipped, matched, onClick }: CardProps) {
  const isFaceUp = flipped || matched;
  const label = card.name || card.text || "カード";

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onClick(card.uid)}
      aria-label={isFaceUp ? label : "裏向きのカード"}
    >
      <div className={`${styles.inner} ${isFaceUp ? styles.isFlipped : ""}`}>
        <div className={styles.front}>
          <span className={styles.questionMark}>?</span>
        </div>
        <div className={styles.back}>
          <div className={styles.imageWrap}>
            {card.file && (
              <Image
                src={`/images/${card.file}`}
                alt={label}
                fill
                sizes="(max-width: 480px) 22vw, 120px"
                className={styles.image}
              />
            )}
            {card.hex && (
              <div style={{ backgroundColor: card.hex, width: '100%', height: '100%', borderRadius: '8px' }}></div>
            )}
            {card.text && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', padding: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', wordBreak: 'break-word', color: '#333' }}>
                  {card.text}
                </span>
              </div>
            )}
          </div>
          {matched && card.name && <span className={styles.name}>{card.name}</span>}
        </div>
      </div>
    </button>
  );
}
