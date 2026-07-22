"use client";

import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { KNOWLEDGE } from "@/lib/knowledge";
import GameLayout, { Scene } from "@/components/GameLayout";

export default function KnowledgeMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");

  const startGame = () => setScene("game");
  const quitGame = () => setScene("menu");

  return (
    <GameLayout
      scene={scene}
      themeVars={{
        "--accent": "#ffd700",
        "--accent-2": "#ffb300",
        "--pink": "#ff8f00",
        "--grad-accent": "linear-gradient(135deg, #ffd700 0%, #ffb300 50%, #ff8f00 100%)"
      } as React.CSSProperties}
      title="知識神経衰弱"
      description="8種類の雑学問題と答えのペアを見つけよう！"
      introContent={<p>※ここにゲームの詳しいルールや紹介文が入ります。</p>}
      menuControls={
        <button className="start-button" onClick={startGame}>
          ゲームスタート
        </button>
      }
    >
      {scene === "game" && (
        <GameBoard 
          cardDefinitions={KNOWLEDGE} 
          theme="knowledge" 
          onQuit={quitGame} 
        />
      )}
    </GameLayout>
  );
}
