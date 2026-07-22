"use client";

import { useState } from "react";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { LANGUAGES } from "@/lib/languages";

export default function LanguageMemoryGame() {
  const [scene, setScene] = useState<"menu" | "game">("menu");

  const startGame = () => {
    setScene("game");
  };

  const quitGame = () => {
    setScene("menu");
  };

  return (
    <div className="game-wrapper" style={{
      "--bg-1": "#2c1c16",
      "--bg-2": "#4a3328",
      "--bg-3": "#1a0f0c",
      "--accent": "#d4a373",
      "--accent-2": "#faedcd",
      "--pink": "#e9edc9",
      "--grad-accent": "linear-gradient(135deg, #d4a373 0%, #faedcd 50%, #e9edc9 100%)"
    } as React.CSSProperties}>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "64px" }}>
        
        {/* メニュー画面 */}
        <div className={`screen ${scene === "menu" ? "active" : ""}`} id="menu-screen">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ marginBottom: "12px", fontSize: "2.4rem" }}>言語神経衰弱</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              日本語と英語の単語ペアを見つけよう！
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
              cardDefinitions={LANGUAGES} 
              theme="language" 
              onQuit={quitGame} 
            />
          )}
        </div>
      </div>
      </div>
  );
}
