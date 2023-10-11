import { EVENT_NAME, REDIS_KEY } from "../constants";
import { setTable, setUser } from "../defaultFormat";
import { Get, Set } from "../redisOperation";
import Event from "../eventEmitter/";
import { delayGame } from "../bull";
import logger from "../logger";
import { joinGameValidation } from "../validation/requestValidation";
import { ResJoinGameValidation, roundTimerValidation } from "../validation/responseValidation";


const GameDelayTime = 5;

const joinGame = async (data: any, socket: any) => {
 try{ 
  data=await joinGameValidation(data);
if(data){  
  let userData = setUser(data.data.userName, socket.id);
  let addUser: any = await Set(
    `${REDIS_KEY.USER}:${userData._id}`,
    userData
  );
  if (addUser) {
    let singUpData = {
      eventName: EVENT_NAME.SIGN_UP,
      data: {
        userId: userData._id,
      },
    };
   await Event.sendToSocket(userData.socketId, singUpData);

    let QueueData: any = await Get(REDIS_KEY.REDIS_QUEUE);
let tableData: any;
    if (QueueData && QueueData.tablesId.length > 0) {
      tableData = await Get(
        `${REDIS_KEY.REDIS_TABLE}:${QueueData.tablesId[0]}`
      );
      tableData.activePlayer += 1;
    }
    if (tableData && tableData.activePlayer == tableData.maxPlayer) {
      socket.tableId = tableData._id;
      socket.user2Id = userData._id;
      tableData.player.push(userData);
      tableData.status='start';
      await Set(`${REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData);
      QueueData.tablesId.shift();
      await Set(
        REDIS_KEY.REDIS_QUEUE,
        { tablesId: QueueData.tablesId }
      );

      socket.join(tableData._id);

      let sendUserData = {
        eventName: EVENT_NAME.JOIN_GAME,
        data: {
          userData: tableData.player,
          tableId: tableData._id,
          board: tableData.board,
          score:[0,0],
          status: tableData.status, 
        },
      };
      let validateUserData=await ResJoinGameValidation(sendUserData);


      await Event.sendToRoom(tableData._id, validateUserData);
      let roundTimerStartData={
        eventName:EVENT_NAME.ROUND_TIMER_START,
        data:{
          delayTime:GameDelayTime,
        }
      }
      let validateRoundTimerData=await roundTimerValidation(roundTimerStartData);

      await Event.sendToRoom(tableData._id,validateRoundTimerData);
      let delayGameData={
        jobId:tableData._id,
        attempts:1,
        delayTime: GameDelayTime*1000,
        userId:tableData.player[0]._id
      }

      delayGame(delayGameData);
    } else {
      let tableData = await setTable(userData,userData._id);
      await Set(
        REDIS_KEY.REDIS_QUEUE,
      { tablesId: [tableData._id] }
      );
      await Set(
        `${REDIS_KEY.REDIS_TABLE}:${tableData._id}`,
        tableData
      );
      socket.join(tableData._id);
      socket.tableId = tableData._id;
      socket.user1Id = userData._id;
      let sendUserData = {
        eventName: EVENT_NAME.JOIN_GAME,
        data: {
          userData: [userData],
          score:[0,0],
          tableId: tableData._id,
          board: tableData.board,
          status: tableData.status,
        },
      };
      let validateUserData=await ResJoinGameValidation(sendUserData);
      await Event.sendToRoom(tableData._id, validateUserData);
    }
  }
}
}catch(error){
    logger.error(`CATCH ERROR IN joinGame : ${error}`)
  }
};
export default joinGame;
