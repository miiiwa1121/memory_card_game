import RhythmMemoryGame from "./components/RhythmMemoryGame";
import { siteUrl, siteName } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../sound-rhythm.css";

// ゲーム本体を表す VideoGame 構造化データ（JSON-LD）。
// 無料・ブラウザプレイ・日本語であることを検索エンジンに明示する。
const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: siteName,
  url: siteUrl,
  description:
    "リズムを聴いて同じパターンのペアを見つけるリズム感神経衰弱。ブラウザだけで無料で遊べる。インストール不要・登録不要。",
  image: `${siteUrl}/opengraph-image`,
  inLanguage: "ja",
  genre: ["神経衰弱", "メモリーゲーム", "音ゲー"],
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
      <main className="sound-rhythm-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
        />
        <RhythmMemoryGame />
      </main>
      <Footer />
    </div>
  );
}
