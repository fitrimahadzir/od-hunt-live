import { GridMode, Difficulty, GameStatus, Winner, LeaderboardEntry, SerializedLeaderboardEntry, GameState } from "../types.js";
import { WAIT_TIME, DIFFICULTY_POINTS, GRID_MODES } from "../config.js";
import { generateGrid, parseCoordinate, getColLabels } from "./grid.js";

export type StateChangeCallback = (state: GameState) => void;

export class GameEngine {
  private grid: string[][] = [];
  private gridMode: GridMode = "LOW";
  private oddCol = 0;
  private oddRow = 0;
  private normalChar = "X";
  private oddChar = "Y";
  private difficulty: Difficulty = "easy";
  private roundNumber = 0;
  private gameStatus: GameStatus = "waiting";
  private winner: Winner | null = null;
  private leaderboard: Record<string, LeaderboardEntry> = {};
  private spamCooldowns: Record<string, number> = {};
  private viewerAnswers: Record<string, boolean> = {};
  private tiktokUsername = "";
  private onStateChange: StateChangeCallback;

  constructor(onStateChange: StateChangeCallback) {
    this.onStateChange = onStateChange;
  }

  getState(): GameState {
    return {
      grid: this.grid,
      gridMode: this.gridMode,
      gridConfig: GRID_MODES[this.gridMode],
      oddPosition: { col: this.oddCol, row: this.oddRow },
      difficulty: this.difficulty,
      normalChar: this.normalChar,
      oddChar: this.oddChar,
      roundNumber: this.roundNumber,
      gameStatus: this.gameStatus,
      winner: this.winner,
      leaderboard: Object.entries(this.leaderboard)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 7),
      tiktokUsername: this.tiktokUsername,
    };
  }

  private broadcast() {
    this.onStateChange(this.getState());
  }

  startNewGame() {
    this.roundNumber = 1;
    this.generateNewGrid();
  }

  setTiktokUsername(username: string) {
    this.tiktokUsername = username;
    this.broadcast();
  }

  private generateNewGrid() {
    const result = generateGrid(this.gridMode);
    this.grid = result.grid;
    this.oddCol = result.oddCol;
    this.oddRow = result.oddRow;
    this.normalChar = result.normalChar;
    this.oddChar = result.oddChar;
    this.difficulty = result.difficulty;
    this.gameStatus = "playing";
    this.winner = null;
    this.viewerAnswers = {};
    this.broadcast();
    const colLabels = getColLabels(this.gridMode);
    console.log(
      `Round #${this.roundNumber}: [${this.gridMode}] ${this.difficulty} normal='${this.normalChar}' odd='${this.oddChar}' at ${colLabels[this.oddCol]}${this.oddRow + 1}`
    );
  }

  handleGuess(
    uniqueId: string,
    nickname: string,
    profilePictureUrl: string,
    text: string
  ) {
    if (this.gameStatus !== "playing") return;

    const now = Date.now();
    if (
      this.spamCooldowns[uniqueId] &&
      now - this.spamCooldowns[uniqueId] < 2000
    )
      return;
    this.spamCooldowns[uniqueId] = now;

    const coord = parseCoordinate(text, this.gridMode);
    if (!coord) return;
    if (this.viewerAnswers[uniqueId]) return;
    this.viewerAnswers[uniqueId] = true;

    if (coord.col === this.oddCol && coord.row === this.oddRow) {
      this.gameStatus = "won";
      this.winner = { uniqueId, nickname, profilePictureUrl };

      if (!this.leaderboard[uniqueId]) {
        this.leaderboard[uniqueId] = {
          wins: 0,
          streak: 0,
          lastWin: 0,
          nickname,
          profilePictureUrl,
        };
      }
      this.leaderboard[uniqueId].wins += DIFFICULTY_POINTS[this.difficulty];
      this.leaderboard[uniqueId].streak += 1;
      this.leaderboard[uniqueId].lastWin = now;
      this.leaderboard[uniqueId].nickname = nickname;
      this.leaderboard[uniqueId].profilePictureUrl = profilePictureUrl;

      this.broadcast();

      setTimeout(() => {
        this.roundNumber++;
        this.generateNewGrid();
      }, WAIT_TIME * 1000);
    }
  }

  skipRound() {
    this.roundNumber++;
    this.generateNewGrid();
  }

  resetGame() {
    this.roundNumber = 1;
    this.leaderboard = {};
    this.generateNewGrid();
  }

  setGridMode(mode: GridMode) {
    this.gridMode = mode;
    this.roundNumber++;
    this.generateNewGrid();
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
    this.roundNumber++;
    this.generateNewGrid();
  }

  simulateCorrect() {
    const colLabels = getColLabels(this.gridMode);
    const label = `${colLabels[this.oddCol]}${this.oddRow + 1}`;
    const uid = "pro_player_" + Math.floor(Math.random() * 100);
    this.handleGuess(
      uid,
      "Pro Player",
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      label
    );
  }

  simulateTopPlayer() {
    const isFitri = Math.random() > 0.5;
    const dummyNum = Math.floor(Math.random() * 1000);
    const dummyUid = isFitri ? "fitrimahadzir" : "dummy_pro_" + dummyNum;
    this.leaderboard[dummyUid] = {
      wins: Math.floor(Math.random() * 50) + 10,
      streak: Math.floor(Math.random() * 5) + 1,
      lastWin: Date.now(),
      nickname: isFitri ? "fitrimahadzir" : `DummyPro${dummyNum}`,
      profilePictureUrl: isFitri
        ? "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dummyUid}`,
    };
    this.broadcast();
  }
}
