import Link from "next/link";
import { siteUrl, siteName } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

// ゲーム本体を表す VideoGame 構造化データ（JSON-LD）。
// 無料・ブラウザプレイ・日本語であることを検索エンジンに明示する。
const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: siteName,
  url: siteUrl,
  description:
    "似たような色を見分ける色覚神経衰弱。8種類の色の違いを見極めよう。ブラウザだけで無料で遊べる。インストール不要・登録不要。",
  image: `${siteUrl}/opengraph-image`,
  inLanguage: "ja",
  genre: ["メモリーゲーム", "神経衰弱", "カジュアルゲーム"],
  gamePlatform: "Web browser",
  operatingSystem: "Web browser",
  applicationCategory: "GameApplication",
  playMode: "SinglePlayer",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
    availability: "https://schema.org/InStock",
  },
};

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main className={styles.main} style={{ flex: 1 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <div className={styles.hero}>
        <h1 className={styles.title}>色覚神経衰弱</h1>
        <p className={styles.subtitle}>
          8種類の似た色からペアを見つけよう！
        </p>
        <Link href="/color/game" className={styles.startButton}>
          ゲームスタート
        </Link>
      </div>
      <Footer />
      </main>
    </div>
  );
}
