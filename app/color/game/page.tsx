import type { Metadata } from "next";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { COLORS } from "@/lib/colors";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "プレイ画面",
  description:
    "8種類の似た色のカードをめくって同じ色のペアを揃える色覚神経衰弱。今すぐブラウザで無料プレイ。",
  alternates: {
    canonical: "/color/game",
  },
};

export default function ColorGame() {
  return (
    <div className={`${styles.page} theme-color`}>
      <nav className={styles.navbar}>
        <Link href="/color" className={styles.backLink}>
          ← 色ゲームトップへ戻る
        </Link>
      </nav>
      <main className={styles.main}>
        <h1 className={styles.heading}>色覚神経衰弱</h1>
        <GameBoard cardDefinitions={COLORS} backLink="/color" theme="color" />
      </main>
    </div>
  );
}
