# SEO セットアップ手順 — 野菜神経衰弱（Cloudflare 版）

Google 検索に載せるための手順です。
**コード対応（①）は完了済み。検索に載せるには ②〜⑥ の手動作業が必要です。**

> 📍 本番URL: `https://vegetable-card-game.miiiwa.workers.dev`
> ホスティング: **Cloudflare Workers（Static Assets / `output: "export"` の静的書き出し）**
> （以前は Vercel `vegetable-card-game.vercel.app` でしたが移行済み）

---

## ① 実装済み（このリポジトリで対応済み）
- `lib/site.ts` … `siteUrl` / `siteName` の**正典**。ドメイン変更はここ1ファイルだけ直せばOK
- `app/layout.tsx` … title / description / keywords / OGP / Twitter カード / `metadataBase` / canonical / title テンプレート / **WebSite 構造化データ(JSON-LD)**
- `app/page.tsx` … トップ画面に **VideoGame 構造化データ(JSON-LD)**（無料・ブラウザ・日本語を明示）
- `app/game/page.tsx` … プレイ画面専用の title / description / canonical
- `app/sitemap.ts` … `/sitemap.xml` を自動生成（`/` と `/game`）。`output: export` 用に `dynamic = "force-static"` 付き
- `app/robots.ts` … `/robots.txt` を自動生成（sitemap への参照付き）。同上
- `app/opengraph-image.tsx` … SNS 共有用のOGP画像（1200×630）を自動生成。同上
- `public/_headers` … 拡張子なしで出力される `opengraph-image` に `Content-Type: image/png` を付与

ビルドで `/robots.txt` `/sitemap.xml` `/opengraph-image` `/game` が生成されることを確認済み。

---

## ② 本番URLの確定（完了済み・確認のみ）
本番URLは `lib/site.ts` の `siteUrl` に設定済み（`https://vegetable-card-game.miiiwa.workers.dev`）。
デプロイ後、ブラウザで以下が表示されればOK:
- `https://vegetable-card-game.miiiwa.workers.dev/robots.txt`
- `https://vegetable-card-game.miiiwa.workers.dev/sitemap.xml`

> ⚠️ `*.workers.dev` はCloudflareの共有ドメインです。長期的には**独自ドメイン**の方が
> 重複コンテンツを避けられSEOに有利。独自ドメインを当てたら `lib/site.ts` の `siteUrl` を変えて再デプロイすること。

---

## ③ 旧 vercel.app の後始末（重要・移行直後にやる）
旧URL `https://vegetable-card-game.vercel.app` が生きていると、新URLと**重複コンテンツ**になり得ます。

おすすめは次のいずれか:
- **(A) Vercel プロジェクトを削除する** … 旧URLは404になり、Googleは数週間で自然にインデックスから外す（最も簡単）
- **(B) 旧URL→新URLへ 301 リダイレクト** … リンク資産を引き継げてSEO的にはベスト。Vercel を残し `vercel.json` でリダイレクト設定する:
  ```json
  {
    "redirects": [
      { "source": "/(.*)", "destination": "https://vegetable-card-game.miiiwa.workers.dev/$1", "permanent": true }
    ]
  }
  ```
> 新規・小規模サイトなら (A) で十分。既に旧URLが検索流入を得ているなら (B) を検討。

---

## ④ Google Search Console に登録する（新ドメインでやり直し）
ドメインが変わったので、**新URLで改めてプロパティを追加**します。

1. https://search.google.com/search-console を開く。
2. プロパティを追加 → **「URL プレフィックス」** を選び、`https://vegetable-card-game.miiiwa.workers.dev` を入力。
   - ※「ドメイン」プロパティはDNS設定が必要で `workers.dev` では使えないため、必ず「URLプレフィックス」を選ぶ。
3. 所有権の確認方法で **「HTML タグ」** を選び、表示される `google-site-verification` トークンを確認。
   - **`app/layout.tsx` に既に入っているトークンと比較する**:
     - **同じ** → そのまま「確認」を押すだけ（コード変更不要）。
     - **違う** → `lib/site.ts`…ではなく `app/layout.tsx` の
       `verification: { google: "..." }` を新トークンに差し替えて再デプロイ → 「確認」。
4. 「確認」ボタンを押して所有権を通す。

---

## ⑤ サイトマップを送信する
1. Search Console（新プロパティ）左メニュー → **「サイトマップ」**。
2. `sitemap.xml` と入力して送信。
3. ステータスが「成功しました」になればOK。

---

## ⑥ インデックス登録をリクエストする（任意・高速化）
1. Search Console 上部の検索窓に `https://vegetable-card-game.miiiwa.workers.dev` を入れて **URL 検査**。
2. 「インデックス登録をリクエスト」を押す。`/game` も同様に。

---

## 確認に使えるツール
- **構造化データ**: https://search.google.com/test/rich-results に本番URLを入れ、WebSite / VideoGame が検出されるか確認。
- **OGP**: 各SNSのデバッガ（Facebook Sharing Debugger 等）でOGP画像が出るか確認。
- **インデックス状況**: Google で `site:vegetable-card-game.miiiwa.workers.dev` を検索。

## 反映の目安
- 検索結果に出るまで **数日〜数週間** かかります（焦らず待つ）。
- ドメイン移行直後は、旧URLが消えて新URLが載るまでタイムラグがあります。
