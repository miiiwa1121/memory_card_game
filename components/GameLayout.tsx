import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export type Scene = "menu" | "game";

export interface GameLayoutProps {
  scene: Scene;
  title: string;
  description: ReactNode;
  introContent: ReactNode;
  menuControls: ReactNode;
  themeVars?: React.CSSProperties;
  children: ReactNode; // Game Screen content
}

export default function GameLayout({
  scene,
  title,
  description,
  introContent,
  menuControls,
  themeVars,
  children,
}: GameLayoutProps) {
  return (
    <>
      {scene === "menu" && <Header />}
      <div className="game-wrapper" style={{ flex: 1, ...themeVars, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* メニュー画面 (1画面分確保して、スクロールで紹介を見せる) */}
      <div style={{ minHeight: "calc(100vh - 80px)", width: "100%", display: scene === "menu" ? "flex" : "none", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div className={`screen ${scene === "menu" ? "active" : ""}`} id="menu-screen">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ marginBottom: "12px", fontSize: "2.4rem" }}>{title}</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              {description}
            </p>
          </div>
          <div className="menu-buttons">
            {menuControls}
          </div>
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
          width: "calc(100% - 48px)",
          textAlign: "center",
          margin: "0 auto 120px"
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "var(--text)" }}>ゲーム紹介</h2>
          <div style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
            {introContent}
          </div>
        </div>
      )}

      {/* ゲーム画面 */}
      <div style={{ minHeight: "calc(100vh - 80px)", width: "100%", display: scene === "game" ? "flex" : "none", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div className="screen active" id="game-screen">
          {children}
        </div>
      </div>
      </div>
      {scene === "menu" && <Footer />}
    </>
  );
}
