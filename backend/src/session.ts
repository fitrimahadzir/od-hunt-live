import { Server } from "socket.io";
import { GameEngine } from "./game/engine.js";
import { TikTokManager } from "./tiktok/client.js";

export interface SessionState {
  gameEngine: GameEngine;
  tiktokManager: TikTokManager;
  createdAt: number;
}

export class SessionManager {
  private sessions: Map<string, SessionState> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  createSession(sessionId: string): SessionState {
    const gameEngine = new GameEngine((state) => {
      this.io.to(sessionId).emit("gameState", state);
    });
    const tiktokManager = new TikTokManager(this.io, gameEngine, sessionId);
    gameEngine.startNewGame();

    const session: SessionState = {
      gameEngine,
      tiktokManager,
      createdAt: Date.now(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getOrCreateSession(sessionId: string): SessionState {
    const existing = this.sessions.get(sessionId);
    if (existing) return existing;
    return this.createSession(sessionId);
  }

  getSession(sessionId: string): SessionState | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.tiktokManager.disconnect();
      session.gameEngine.resetGame();
      this.sessions.delete(sessionId);
    }
  }

  getAllSessions() {
    return this.sessions;
  }

  getSessionCount() {
    return this.sessions.size;
  }
}
