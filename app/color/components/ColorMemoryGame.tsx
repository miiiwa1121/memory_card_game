"use client";

import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { COLORS } from "@/lib/colors";
import GameLayout, { Scene } from "@/components/GameLayout";

export default function ColorMemoryGame() {
  const [scene, setScene] = useState<Scene>("menu");

  const startGame = () => setScene("game");
  const quitGame = () => setScene("menu");

  return (
    <GameLayout
      scene={scene}
      themeVars={{
        "--accent": "#ff9a9e",
        "--accent-2": "#fecfef",
        "--pink": "#a1c4fd",
        "--grad-accent": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a1c4fd 100%)"
      } as React.CSSProperties}
      title="色覚神経衰弱"
      description="微妙な色の違いを見分ける神経衰弱に挑戦しよう！"
      introContent={<p>※ここにゲームの詳しいルールや紹介文が入ります。</p>}
      menuControls={
        <button className="start-button" onClick={startGame}>
          ゲームスタート
        </button>
      }
    >
      {scene === "game" && (
        <GameBoard 
          cardDefinitions={COLORS} 
          theme="color" 
          onQuit={quitGame} 
        />
      )}
    </GameLayout>
  );
}
