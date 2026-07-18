import type { Metadata } from "next";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { KNOWLEDGE } from "@/lib/knowledge";
import { CardData } from "@/components/Card";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "プレイ画面",
  description:
    "8種類のカードをめくって雑学の問題と答えのペアを揃える神経衰弱。今すぐブラウザで無料プレイ。",
  alternates: {
    canonical: "/knowledge/game",
  },
};

export default function GamePage() {
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/knowledge" className={styles.backLink}>
          ← 知識ゲームトップへ戻る
        </Link>
      </nav>
      <main className={styles.main}>
        <h1 className={styles.heading}>知識神経衰弱</h1>
        <GameBoard 
          initialDeck={KNOWLEDGE.flatMap(k => [
            { id: k.id, text: k.question },
            { id: k.id, text: k.answer }
          ])} 
          backLink="/knowledge" 
        />
      </main>
    </div>
  );
}
