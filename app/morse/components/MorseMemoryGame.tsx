"use client";

import { useState } from "react";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { MORSE } from "@/lib/morse";

export default function MorseMemoryGame() {
  const [scene, setScene] = useState<"menu" | "game">("menu");

  const startGame = () => {
    setScene("game");
  };

  const quitGame = () => {
    setScene("menu");
  };

  return (
    <div className="game-wrapper" style={{
      "--bg-1": "#000000",
      "--bg-2": "#052205",
      "--bg-3": "#001100",
      "--accent": "#00ff41",
      "--accent-2": "#008f11",
      "--pink": "#003b00",
      "--grad-accent": "linear-gradient(135deg, #00ff41 0%, #008f11 50%, #00ff41 100%)"
    } as React.CSSProperties}>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "64px" }}>
        
        {/* メニュー画面 */}
        <div className={`screen ${scene === "menu" ? "active" : ""}`} id="menu-screen">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ marginBottom: "12px", fontSize: "2.4rem" }}>モールス神経衰弱</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              ひらがなとモールス信号のペアを見つけよう！
            </p>
          </div>
          <div className="menu-buttons">
            <button
              className="start-button"
              onClick={startGame}
            >
              ゲームスタート
            </button>
          </div>
        </div>

        {/* ゲーム紹介（スクロール先） */}
        {scene === "menu" && (
          <div style={{
            background: "var(--surface)",
            padding: "48px 40px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
            backdropFilter: "blur(22px)",
            maxWidth: "800px",
            width: "100%",
            textAlign: "center"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "var(--text)" }}>ゲーム紹介</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
              ※ここにゲームの詳しいルールや紹介文が入ります。
            </p>
          </div>
        )}

        {/* ゲーム画面 */}
        <div className={`screen ${scene === "game" ? "active" : ""}`} id="game-screen">
          {scene === "game" && (
            <GameBoard 
              cardDefinitions={MORSE} 
              theme="morse" 
              onQuit={quitGame} 
            />
          )}
        </div>
      </div>
      </div>
  );
}
