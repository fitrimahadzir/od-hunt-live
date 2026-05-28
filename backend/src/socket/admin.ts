import { Server } from "socket.io";
import { GameEngine } from "../game/engine.js";
import { AdminAction, GridMode } from "../types.js";
import { GRID_MODES } from "../config.js";

export function handleAdminAction(
  io: Server,
  gameEngine: GameEngine,
  action: AdminAction
) {
  switch (action.type) {
    case "skip":
      gameEngine.skipRound();
      break;

    case "reset":
      gameEngine.resetGame();
      break;

    case "simulateChat":
      gameEngine.handleGuess(
        action.uniqueId || "dev_user",
        action.nickname || "Developer",
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.uniqueId || "dev_user"}`,
        action.comment || ""
      );
      break;

    case "simulateCorrect":
      gameEngine.simulateCorrect();
      break;

    case "simulateGift":
      io.emit("notification", {
        type: "gift",
        data: {
          uniqueId: action.uniqueId || "dev_user",
          nickname: action.nickname || "Developer",
          giftName: action.giftName || "Heart",
          profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.uniqueId || "dev_user"}`,
        },
      });
      break;

    case "setGridMode":
      if (action.mode && GRID_MODES[action.mode as GridMode]) {
        gameEngine.setGridMode(action.mode as GridMode);
      }
      break;

    case "simulateTopPlayer":
      gameEngine.simulateTopPlayer();
      break;
  }
}
