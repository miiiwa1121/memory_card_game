// サイト全体で使う定数の正典（single source of truth）。
// ドメインを変更したら、ここの siteUrl だけ直せば
// layout / sitemap / robots / JSON-LD すべてに反映される。
//
// 現在: Cloudflare Workers（Static Assets）の本番ドメイン
// （Cloudflare ダッシュボード → Workers & Pages → 該当 Worker の URL）
// 独自ドメインを割り当てたら、その値に変更すること。
export const siteUrl = "https://synesthesium-card-game.miiiwa.workers.dev"; // 仮の新しいドメインとして設定

export const siteName = "Synesthesium | 感覚を刺激する神経衰弱コレクション";

export const siteDescription = "音階、色覚、モールス、リズムなど、様々な感覚を研ぎ澄ます無料の神経衰弱ゲーム・コレクション。ブラウザで無料でプレイできます。";
