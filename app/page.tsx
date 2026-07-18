import Link from "next/link";
import { siteUrl, siteName } from "@/lib/site";
import styles from "./page.module.css";

const games = [
  { name: "野菜神経衰弱", desc: "8種類の野菜カードのペアを揃える", url: "/vegetable" },
  { name: "音階神経衰弱", desc: "ピアノの音を聴き分けて同じ音程のペアを揃える", url: "/sound" },
  { name: "色覚神経衰弱", desc: "似たような色のペアを見分ける", url: "/color" },
  { name: "言語神経衰弱", desc: "日本語と英語の単語ペアを見つける", url: "/language" },
  { name: "モールス神経衰弱", desc: "ひらがなとモールス信号のペアを見つける", url: "/morse" },
  { name: "リズム感神経衰弱", desc: "リズムを聴いて同じパターンのペアを見つける", url: "/rhythm" },
  { name: "知識神経衰弱", desc: "雑学問題と答えのペアを見つける", url: "/knowledge" }
];

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>神経衰弱コレクション</h1>
        <p className={styles.subtitle}>
          様々なテーマで作られた神経衰弱ゲームのまとめサイトです。
        </p>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem', maxWidth: '600px', width: '100%' }}>
          {games.map(game => (
            <Link key={game.name} href={game.url} style={{ display: 'block', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{game.name}</h2>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{game.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
