import { GridMode, Difficulty } from "./types.js";

export const WAIT_TIME = 5;

export const GRID_MODES: Record<GridMode, { cols: number; rows: number }> = {
  LOW: { cols: 12, rows: 10 },
  MEDIUM: { cols: 15, rows: 11 },
  HIGH: { cols: 18, rows: 12 },
};

export const ALL_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function getColLabels(mode: GridMode): string {
  return ALL_LABELS.slice(0, GRID_MODES[mode].cols);
}

export const DIFFICULTY_PAIRS: Record<string, { normal: string; odd: string }[]> = {
  easy: [
    { normal: "A", odd: "B" },
    { normal: "3", odd: "8" },
  ],
  medium: [
    { normal: "O", odd: "Q" },
    { normal: "P", odd: "R" },
    { normal: "5", odd: "6" },
  ],
  hard: [
    { normal: "M", odd: "N" },
    { normal: "C", odd: "G" },
    { normal: "8", odd: "9" },
  ],
  impossible: [
    { normal: "I", odd: "l" },
    { normal: "O", odd: "0" },
    { normal: "B", odd: "8" },
    { normal: "S", odd: "5" },
  ],
};

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 5,
  impossible: 15,
};
