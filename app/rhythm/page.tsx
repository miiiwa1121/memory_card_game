import RhythmMemoryGame from "./components/RhythmMemoryGame";
import { siteUrl, siteName } from "@/lib/site";
import "../game-theme.css";

// ゲーム本体を表す VideoGame 構造化データ（JSON-LD）。
// 無料・ブラウザプレイ・日本語であることを検索エンジンに明示する。
const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: siteName,
  url: siteUrl,
  description:
    "カードをめくってドラムなどのリズムを聴き分ける、ブラウザだけで遊べる無料の神経衰弱ゲーム。同じパターンのペアを揃えよう。インストール不要・登録不要。",
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
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
        />
        <RhythmMemoryGame />
      </main>
    </div>
  );
}
