"use client";

import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { VEGETABLES } from "@/lib/vegetables";
import GameLayout, { Scene } from "@/components/GameLayout";

export default function VegetableMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");

  const startGame = () => setScene("game");
  const quitGame = () => setScene("menu");

  return (
    <GameLayout
      scene={scene}
      themeVars={{
        "--accent": "#66bb6a",
        "--accent-2": "#81c784",
        "--pink": "#a5d6a7",
        "--grad-accent": "linear-gradient(135deg, #66bb6a 0%, #81c784 50%, #a5d6a7 100%)"
      } as React.CSSProperties}
      title="野菜神経衰弱"
      description="8種類の野菜カードで神経衰弱に挑戦しよう！"
      introContent={<p>※ここにゲームの詳しいルールや紹介文が入ります。</p>}
      menuControls={
        <button className="start-button" onClick={startGame}>
          ゲームスタート
        </button>
      }
    >
      {scene === "game" && (
        <GameBoard 
          cardDefinitions={VEGETABLES} 
          theme="vegetable" 
          onQuit={quitGame} 
        />
      )}
    </GameLayout>
  );
}
