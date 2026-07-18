/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 向けに静的書き出し（out/ ディレクトリを生成）
  output: "export",
  // 静的書き出しでは next/image の最適化サーバーが無いため無効化が必須
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
