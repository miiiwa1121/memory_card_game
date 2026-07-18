export type KnowledgePair = {
  id: string;
  question: string;
  answer: string;
};

export const KNOWLEDGE: KnowledgePair[] = [
  { id: "k1", question: "日本で一番高い山", answer: "富士山" },
  { id: "k2", question: "世界で一番長い川", answer: "ナイル川" },
  { id: "k3", question: "光の三原色", answer: "赤・緑・青" },
  { id: "k4", question: "元素記号「H」", answer: "水素" },
  { id: "k5", question: "太陽系で一番大きい惑星", answer: "木星" },
  { id: "k6", question: "円周率の始まり", answer: "3.14159..." },
  { id: "k7", question: "夏目漱石のデビュー作", answer: "吾輩は猫である" },
  { id: "k8", question: "世界最大の哺乳類", answer: "シロナガスクジラ" },
];
