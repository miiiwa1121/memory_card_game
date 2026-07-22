"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const games = [
  { name: "野菜", desc: "8種類の野菜カードのペアを揃える", url: "/vegetable", emoji: "🥬" },
  { name: "音階", desc: "ピアノの音を聴き分けて同じ音程のペアを揃える", url: "/sound", emoji: "🎵" },
  { name: "色覚", desc: "似たような色のペアを見分ける", url: "/color", emoji: "🎨" },
  { name: "言語", desc: "日本語と英語の単語ペアを見つける", url: "/language", emoji: "🌏" },
  { name: "モールス", desc: "ひらがなとモールス信号のペアを見つける", url: "/morse", emoji: "📡" },
  { name: "リズム感", desc: "リズムを聴いて同じパターンのペアを見つける", url: "/rhythm", emoji: "🥁" },
  { name: "知識", desc: "雑学問題と答えのペアを見つける", url: "/knowledge", emoji: "📚" }
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);

  const handleCardClick = (game: typeof games[0]) => {
    setSelectedGame(game);
  };

  const closePopup = () => {
    setSelectedGame(null);
  };

  // Bento Gridのサイズ割り当てロジック
  const getBentoClass = (index: number) => {
    switch (index) {
      case 0: return `${styles.bentoCard} ${styles.size2x2}`; // 1. 野菜
      case 1: return `${styles.bentoCard} ${styles.size2x1}`; // 2. 音階
      case 2: return `${styles.bentoCard} ${styles.size1x1}`; // 3. 色覚
      case 3: return `${styles.bentoCard} ${styles.size1x1}`; // 4. 言語
      case 4: return `${styles.bentoCard} ${styles.size2x1}`; // 5. モールス
      case 5: return `${styles.bentoCard} ${styles.size3x1}`; // 6. リズム感
      case 6: return `${styles.bentoCard} ${styles.size2x1}`; // 7. 知識
      default: return `${styles.bentoCard} ${styles.size1x1}`;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Synesthesium</h1>
          <p className={styles.subtitle}>
            様々なテーマで作られた、脳を刺激するメモリーゲームコレクション。
          </p>
        </header>

        {/* Bento Grid レイアウト (5列) */}
        <div className={styles.bentoGrid}>
          {games.map((game, i) => {
            return (
              <div 
                key={game.url} 
                className={getBentoClass(i)}
                onClick={() => handleCardClick(game)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(game);
                  }
                }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.iconWrap}>
                    <span className={styles.emoji}>{game.emoji}</span>
                  </div>
                  <div className={styles.textWrap}>
                    <h2 className={styles.cardTitle}>{game.name}</h2>
                    <p className={styles.cardDesc}>{game.desc}</p>
                  </div>
                  {/* 矢印は直接遷移（イベント伝播を停止） */}
                  <Link 
                    href={game.url} 
                    className={styles.arrow}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${game.name}ゲームを開始する`}
                  >
                    →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 詳細ポップアップ */}
      {selectedGame && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div 
            className={styles.popupContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.popupClose} onClick={closePopup} aria-label="閉じる">
              ✕
            </button>
            <div className={styles.popupIconWrap}>
              <span className={styles.popupEmoji}>{selectedGame.emoji}</span>
            </div>
            <h2 className={styles.popupTitle}>{selectedGame.name}神経衰弱</h2>
            <p className={styles.popupDesc}>{selectedGame.desc}</p>
            <div className={styles.popupActions}>
              <Link href={selectedGame.url} className={styles.popupPlayButton}>
                ゲームをプレイする
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
