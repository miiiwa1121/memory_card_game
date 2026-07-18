import type { Metadata } from "next";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { VEGETABLES } from "@/lib/vegetables";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "プレイ画面",
  description:
    "8種類の野菜カードをめくって同じ野菜のペアを揃える神経衰弱。今すぐブラウザで無料プレイ。",
  alternates: {
    canonical: "/vegetable/game",
  },
};

export default function GamePage() {
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/vegetable" className={styles.backLink}>
          ← 野菜ゲームトップへ戻る
        </Link>
      </nav>
      <main className={styles.main}>
        <h1 className={styles.heading}>野菜神経衰弱</h1>
        <GameBoard cardDefinitions={VEGETABLES} backLink="/vegetable" />
      </main>
    </div>
  );
}
