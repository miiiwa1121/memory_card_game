// サイト全体で使う定数の正典（single source of truth）。
// ドメインを変更したら、ここの siteUrl だけ直せば
// layout / sitemap / robots / JSON-LD すべてに反映される。
//
// 現在: Cloudflare Workers（Static Assets）の本番ドメイン
// （Cloudflare ダッシュボード → Workers & Pages → 該当 Worker の URL）
// 独自ドメインを割り当てたら、その値に変更すること。
export const siteUrl = "https://morse-card-game.vercel.app";

export const siteName = "モールス神経衰弱 | Morse Card Game";

export const siteDescription = "8種類の文字でひらがなとモールス信号のペアを見つけるモールス神経衰弱。ブラウザで無料でプレイできます。";
