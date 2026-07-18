export type ColorCard = {
  id: string;
  hex: string;
  name: string;
};

// 8組の似たような色（例：様々な系統の青・緑など微妙な違いを持たせる）
export const COLORS: ColorCard[] = [
  { id: "blue1", hex: "#E3F2FD", name: "ライトブルー" },
  { id: "blue2", hex: "#BBDEFB", name: "ペールブルー" },
  { id: "blue3", hex: "#90CAF9", name: "スカイブルー" },
  { id: "blue4", hex: "#64B5F6", name: "マリンブルー" },
  { id: "green1", hex: "#E8F5E9", name: "ライトグリーン" },
  { id: "green2", hex: "#C8E6C9", name: "ペールグリーン" },
  { id: "green3", hex: "#A5D6A7", name: "ミントグリーン" },
  { id: "green4", hex: "#81C784", name: "リーフグリーン" },
];
