import type { Metadata } from "next";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { MORSE } from "@/lib/morse";
import { CardData } from "@/components/Card";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "プレイ画面",
  description:
    "8種類のカードをめくってひらがなとモールス信号のペアを揃える神経衰弱。今すぐブラウザで無料プレイ。",
  alternates: {
    canonical: "/morse/game",
  },
};

export default function GamePage() {
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/morse" className={styles.backLink}>
          ← モールスゲームトップへ戻る
        </Link>
      </nav>
      <main className={styles.main}>
        <h1 className={styles.heading}>モールス神経衰弱</h1>
        <GameBoard 
          initialDeck={MORSE.flatMap(m => [
            { id: m.id, text: m.char },
            { id: m.id, text: m.morse }
          ])} 
          backLink="/morse" 
        />
      </main>
    </div>
  );
}
