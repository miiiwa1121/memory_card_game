"use client";

import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { LANGUAGES } from "@/lib/languages";
import GameLayout, { Scene } from "@/components/GameLayout";

export default function LanguageMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");

  const startGame = () => setScene("game");
  const quitGame = () => setScene("menu");

  return (
    <GameLayout
      scene={scene}
      themeVars={{
        "--accent": "#d4a373",
        "--accent-2": "#faedcd",
        "--pink": "#e9edc9",
        "--grad-accent": "linear-gradient(135deg, #d4a373 0%, #faedcd 50%, #e9edc9 100%)"
      } as React.CSSProperties}
      title="言語神経衰弱"
      description="日本語と英語の単語ペアを見つけよう！"
      introContent={<p>※ここにゲームの詳しいルールや紹介文が入ります。</p>}
      menuControls={
        <button className="start-button" onClick={startGame}>
          ゲームスタート
        </button>
      }
    >
      {scene === "game" && (
        <GameBoard 
          cardDefinitions={LANGUAGES} 
          theme="language" 
          onQuit={quitGame} 
        />
      )}
    </GameLayout>
  );
}
