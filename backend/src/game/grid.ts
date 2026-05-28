import { GridMode, Difficulty } from "../types.js";
import { GRID_MODES, ALL_LABELS, DIFFICULTY_PAIRS } from "../config.js";

export function getColLabels(mode: GridMode): string {
  return ALL_LABELS.slice(0, GRID_MODES[mode].cols);
}

export function generateGrid(
  gridMode: GridMode
): {
  grid: string[][];
  oddCol: number;
  oddRow: number;
  normalChar: string;
  oddChar: string;
  difficulty: Difficulty;
} {
  const { cols, rows } = GRID_MODES[gridMode];
  const keys = Object.keys(DIFFICULTY_PAIRS) as Difficulty[];
  const difficulty = keys[Math.floor(Math.random() * keys.length)];
  const pairs = DIFFICULTY_PAIRS[difficulty];
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const normalChar = pair.normal;
  const oddChar = pair.odd;
  const oddCol = Math.floor(Math.random() * cols);
  const oddRow = Math.floor(Math.random() * rows);

  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      r === oddRow && c === oddCol ? oddChar : normalChar
    )
  );

  return { grid, oddCol, oddRow, normalChar, oddChar, difficulty };
}

export function parseCoordinate(
  text: string,
  gridMode: GridMode
): { col: number; row: number } | null {
  const { cols, rows } = GRID_MODES[gridMode];
  const colLabels = getColLabels(gridMode);
  const cleaned = text.trim().toUpperCase().replace(/-/g, "");
  const m1 = cleaned.match(/^([A-Z])(\d{1,2})$/);
  if (m1) {
    const col = colLabels.indexOf(m1[1]);
    const row = parseInt(m1[2]) - 1;
    if (col >= 0 && row >= 0 && row < rows) return { col, row };
  }
  const m2 = cleaned.match(/^(\d{1,2})([A-Z])$/);
  if (m2) {
    const row = parseInt(m2[1]) - 1;
    const col = colLabels.indexOf(m2[2]);
    if (col >= 0 && row >= 0 && row < rows) return { col, row };
  }
  return null;
}
