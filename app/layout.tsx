import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/site";
import "./globals.css";

const title = "Synesthesium | 感覚を刺激する神経衰弱ゲーム・コレクション";
const description =
  "音階、色覚、モールス、リズムなど、様々な感覚を研ぎ澄ます無料の神経衰弱ゲーム。ブラウザだけで無料で遊べる。インストール不要・登録不要。";

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
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "3UDpEw_GN1HaR6_kVrLr8GAz14C4lICEZVtEiCmarVg" },
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
        {children}
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || '2f362152bf744e7b8c291ac9b674240c'}"}`}
        />
      </body>
    </html>
  );
}
