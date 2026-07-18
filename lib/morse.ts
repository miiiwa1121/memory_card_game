export type MorsePair = {
  id: string;
  char: string;
  morse: string;
};

export const MORSE: MorsePair[] = [
  { id: "a", char: "あ", morse: "--.--" },
  { id: "i", char: "い", morse: ".-" },
  { id: "u", char: "う", morse: "..-" },
  { id: "e", char: "え", morse: "-.---" },
  { id: "o", char: "お", morse: ".-..." },
  { id: "ka", char: "か", morse: ".-.." },
  { id: "ki", char: "き", morse: "-.-.." },
  { id: "ku", char: "く", morse: "...-" },
];
