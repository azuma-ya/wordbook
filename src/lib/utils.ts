import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const label = (level: number) => {
  switch (level) {
    case -1:
      return "苦手";
    case 0:
      return "まだ";
    case 1:
      return "うろ覚え";
    case 2:
      return "ほぼ覚えた";
    case 3:
      return "覚えた";
    default:
      return "覚えた";
  }
};
