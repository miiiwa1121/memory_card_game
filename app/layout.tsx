import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const title = "野菜神経衰弱 | 8種の野菜で遊ぶ無料のメモリーカードゲーム";
const description =
  "ほうれん草・小松菜・春菊など8種類の野菜カードで楽しむ神経衰弱（メモリーカードゲーム）。ブラウザだけで無料で遊べる。インストール不要・登録不要。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "野菜神経衰弱",
    "神経衰弱",
    "メモリーゲーム",
    "野菜",
    "カードゲーム",
    "無料ゲーム",
    "ブラウザゲーム",
    "知育",
    "子供",
  ],
  alternates: {
    canonical: "/",
  },
  // Google Search Console 所有権確認用トークン
  verification: { google: "3UDpEw_GN1HaR6_kVrLr8GAz14C4lICEZVtEiCmarVg" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// サイト全体を表す WebSite 構造化データ（JSON-LD）
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "ja",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "2f362152bf744e7b8c291ac9b674240c"}'
        />
      </body>
    </html>
  );
}
