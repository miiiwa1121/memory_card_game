"use client";

import { useState } from "react";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { VEGETABLES } from "@/lib/vegetables";

export default function VegetableMemoryGame() {
  const [scene, setScene] = useState<"menu" | "game">("menu");

  const startGame = () => {
    setScene("game");
  };

  const quitGame = () => {
    setScene("menu");
  };

  return (
    <div className="game-wrapper" style={{
      "--bg-1": "#1b5e20",
      "--bg-2": "#2e7d32",
      "--bg-3": "#003300",
      "--accent": "#66bb6a",
      "--accent-2": "#81c784",
      "--pink": "#a5d6a7",
      "--grad-accent": "linear-gradient(135deg, #66bb6a 0%, #81c784 50%, #a5d6a7 100%)"
    } as React.CSSProperties}>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "64px" }}>
        
        {/* メニュー画面 */}
        <div className={`screen ${scene === "menu" ? "active" : ""}`} id="menu-screen">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ marginBottom: "12px", fontSize: "2.4rem" }}>野菜神経衰弱</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              8種類の野菜カードで神経衰弱に挑戦しよう！
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
              cardDefinitions={VEGETABLES} 
              theme="vegetable" 
              onQuit={quitGame} 
            />
          )}
        </div>
      </div>
      </div>
  );
}
