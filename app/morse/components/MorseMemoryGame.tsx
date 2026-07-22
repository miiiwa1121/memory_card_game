"use client";

import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { MORSE } from "@/lib/morse";
import GameLayout, { Scene } from "@/components/GameLayout";

export default function MorseMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");

  const startGame = () => setScene("game");
  const quitGame = () => setScene("menu");

  return (
    <GameLayout
      scene={scene}
      themeVars={{
        "--accent": "#00ff41",
        "--accent-2": "#008f11",
        "--pink": "#003b00",
        "--grad-accent": "linear-gradient(135deg, #00ff41 0%, #008f11 50%, #00ff41 100%)"
      } as React.CSSProperties}
      title="モールス神経衰弱"
      description="ひらがなとモールス信号のペアを見つけよう！"
      introContent={<p>※ここにゲームの詳しいルールや紹介文が入ります。</p>}
      menuControls={
        <button className="start-button" onClick={startGame}>
          ゲームスタート
        </button>
      }
    >
      {scene === "game" && (
        <GameBoard 
          cardDefinitions={MORSE} 
          theme="morse" 
          onQuit={quitGame} 
        />
      )}
    </GameLayout>
  );
}
