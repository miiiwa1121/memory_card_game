import type { Metadata } from "next";
import Link from "next/link";
import GameBoard from "@/components/GameBoard";
import { LANGUAGES } from "@/lib/languages";
import { CardData } from "@/components/Card";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "プレイ画面",
  description:
    "8種類の単語カードをめくって日本語と英語のペアを揃える言語神経衰弱。今すぐブラウザで無料プレイ。",
  alternates: {
    canonical: "/language/game",
  },
};

export default function LanguageGame() {
  return (
    <div className={`${styles.page} theme-language`}>
      <nav className={styles.navbar}>
        <Link href="/language" className={styles.backLink}>
          ← 言語ゲームトップへ戻る
        </Link>
      </nav>
      <main className={styles.main}>
        <h1 className={styles.heading}>言語神経衰弱</h1>
        <GameBoard 
          initialDeck={LANGUAGES.flatMap(lang => [
            { id: lang.id, text: lang.ja },
            { id: lang.id, text: lang.en }
          ])} 
          backLink="/language" 
          theme="language"
        />
      </main>
    </div>
  );
}
