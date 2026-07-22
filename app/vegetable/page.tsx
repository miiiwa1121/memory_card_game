import VegetableMemoryGame from "./components/VegetableMemoryGame";
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
    "ほうれん草・小松菜・春菊など8種類の野菜カードで楽しむ神経衰弱（メモリーカードゲーム）。ブラウザだけで無料で遊べる。インストール不要・登録不要。",
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
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
        <VegetableMemoryGame />
      </main>
    </div>
  );
}
