import { EVENT_NAME, REDIS_KEY } from "../constants";
import { Get, Set } from "../redisOperation";
import Event from "../eventEmitter";
import logger from "../logger";
import { disconnect } from "./";
import { moveValidation } from "../validation/requestValidation";
import { ResMoveValidation,userTurnStartValidation, winValidation } from "../validation/responseValidation";
const move = async (data: any, socket: any) => {
  try {
    data = await moveValidation(data);
    if (data) {
      let tableData = socket.tableId
        ? await Get(`${REDIS_KEY.REDIS_TABLE}:${socket.tableId}`)
        : null;
      if (tableData) {
        let board: number[][] = tableData.board;
        let oldIndex = parseInt(data.data.id.slice(1));
        let newIndex = parseInt(data.data.moveId.slice(1));

        let oldRow: number =
          oldIndex % 8 == 0
            ? Math.floor(oldIndex / 8) - 1
            : Math.floor(oldIndex / 8);
        let oldCol = oldIndex - oldRow * 8 - 1;

        let newRow: number =
          newIndex % 8 == 0
            ? Math.floor(newIndex / 8) - 1
            : Math.floor(newIndex / 8);
        let newCol = newIndex - newRow * 8 - 1;

        let color = data.data.color;
        if (!board[newRow][newCol]) {
          board[oldRow][oldCol] = 0;

          board[newRow][newCol] = color;

          if (newRow == 0 || newRow == 7) {
            board[newRow][newCol] = color == 2 || color == 5 ? 5 : 8;
          }

          if (data.data.kill) {
            board[data.data.kill[0]][data.data.kill[1]] = 0;

            if (color == 1 || color == 8) {
              tableData.playerScore[0] = tableData.playerScore[0] + 1;
            } else {
              tableData.playerScore[1] = tableData.playerScore[1] + 1;
            }
          }
          tableData.board = board;
          await Set(
            `${REDIS_KEY.REDIS_TABLE}:${tableData._id}`,
            tableData
          );
          let moveData = {
            eventName: EVENT_NAME.MOVE,
            data: {
              board: board,
              score: tableData.playerScore,
            },
          };
          let validateMoveData=await ResMoveValidation(moveData);
          Event.sendToRoom(socket.tableId, validateMoveData);

          if (tableData.playerScore[0] == 12 ||tableData.playerScore[1] == 12) {
            let winData: any = {
              eventName: EVENT_NAME.WIN,
              data: {
                winnerId: null,
              },
            };
            if (tableData.playerScore[0] == 12) {
              winData.data.winnerId = tableData.player[0]._id;
            } else if (tableData.playerScore[1] == 12) {
              winData.data.winnerId = tableData.player[1]._id;
            }
            let validateWinData=await winValidation(winData);
            await Event.sendToRoom(socket.tableId, validateWinData);
            disconnect(socket);
          }
         let turnId =(tableData.turnId == tableData.player[0]._id) ? tableData.player[1]._id: tableData.player[0]._id;
         tableData.turnId=turnId;
         await Set(`${REDIS_KEY.REDIS_TABLE}:${tableData._id}`,tableData);
          let userTurnStartData = {
            eventName: EVENT_NAME.USER_TURN_START,
            data: {
              userId:turnId,
            },
          };
          let validateUserTurnData=await userTurnStartValidation(userTurnStartData);
          await Event.sendToRoom(tableData._id, validateUserTurnData);
        }
      }
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN move : ${error}`);
  }
};
export default move;
