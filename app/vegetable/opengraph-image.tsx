import { ImageResponse } from "next/og";

// output: export（静的書き出し）でビルド時にOGP画像を生成するため必須
export const dynamic = "force-static";

// SNS 共有時に表示されるOGP画像（1200x630）を動的生成します。
// 追加ライブラリ不要。日本語フォントを埋め込んでいないため画像内テキストは英字にしています。
export const alt = "Vegetable Memory Card Game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const cardColors = ["#86efac", "#fde68a", "#fca5a5", "#93c5fd", "#c4b5fd", "#6ee7b7"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #16a34a 0%, #15803d 55%, #166534 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 18, marginBottom: 48 }}>
          {cardColors.map((c) => (
            <div
              key={c}
              style={{
                width: 84,
                height: 110,
                borderRadius: 18,
                background: c,
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>
          Vegetable Memory Game
        </div>
        <div style={{ fontSize: 34, marginTop: 16, color: "#dcfce7" }}>
          Flip & match 8 veggies. Free to play.
        </div>
      </div>
    ),
    { ...size }
  );
}
