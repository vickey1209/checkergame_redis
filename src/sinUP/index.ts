import { EVENT_NAME, REDIS_KEY } from "../constants";
import Event from "../eventEmitter";
import { SignUpInterface } from "../interface/otherInterface";
import Table from "../interface/tableInterface";
import User from "../interface/userInterface";
import { joinGame } from "../playing";
import { Get ,Set} from "../redisOperation";

export async function signUp(data: SignUpInterface, socket:any){
    console.log("data",data);
    
    if(data.data.userId && data.data.tableId){

        let userData:User=await Get(`${REDIS_KEY.USER}:${data.data.userId}`);
        userData.socketId=(socket.id)?socket.id:null;
        await Set(`${REDIS_KEY.USER}:${data.data.userId}`,userData);
        let tableData :Table=await Get(`${REDIS_KEY.REDIS_TABLE}:${data.data.tableId}`);
        socket.join(tableData._id);
        socket.tableId=tableData._id;
        let sinUPData={
            eventName:EVENT_NAME.SIGN_UP,
            data:{
                userId:userData._id
            }
        }
        Event.sendToSocket(socket.id,sinUPData);
        let sendUserData = {
            eventName: EVENT_NAME.JOIN_GAME,
            data: {
              userData: tableData.player,
              tableId: tableData._id,
              board: tableData.board,
              score:[0,0],
              status: "start", 
            },
          };
        Event.sendToRoom(tableData._id,sendUserData);
        let userTurnStartData={
            eventName:EVENT_NAME.USER_TURN_START,
            data:{
                userId:tableData.turnId,
            }
        }
        Event.sendToRoom(tableData._id,userTurnStartData)
    }else {
        joinGame(data,socket);
    }
}