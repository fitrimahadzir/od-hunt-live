export type GridMode = "LOW" | "MEDIUM" | "HIGH";

export type Difficulty = "easy" | "medium" | "hard" | "impossible";

export type GameStatus = "waiting" | "playing" | "won";

export interface GridConfig {
  cols: number;
  rows: number;
}

export interface Winner {
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
}

export interface LeaderboardEntry {
  wins: number;
  streak: number;
  lastWin: number;
  nickname?: string;
  profilePictureUrl?: string;
}

export interface SerializedLeaderboardEntry {
  userId: string;
  wins: number;
  streak: number;
  lastWin: number;
  nickname?: string;
  profilePictureUrl?: string;
}

export interface GameState {
  grid: string[][];
  gridMode: GridMode;
  gridConfig: GridConfig;
  oddPosition: { col: number; row: number };
  difficulty: Difficulty;
  normalChar: string;
  oddChar: string;
  roundNumber: number;
  gameStatus: GameStatus;
  winner: Winner | null;
  leaderboard: SerializedLeaderboardEntry[];
  tiktokUsername: string;
}

export interface TikTokStatus {
  status: "disconnected" | "connecting" | "connected" | "error";
  roomId?: string;
  message?: string;
}

export interface Notification {
  type: "gift" | "like" | "follow" | "powerup";
  data: Record<string, any>;
}

export interface AdminAction {
  type: string;
  mode?: GridMode;
  uniqueId?: string;
  nickname?: string;
  comment?: string;
  giftName?: string;
  count?: number;
}
