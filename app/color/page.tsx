import ColorMemoryGame from "./components/ColorMemoryGame";
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
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
        />
        <ColorMemoryGame />
      </main>
    </div>
  );
}
