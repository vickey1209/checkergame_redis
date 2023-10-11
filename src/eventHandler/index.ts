import { Socket } from "socket.io";
import logger from "../logger";
import { EVENT_NAME } from "../constants";
import {checkPOssibility, joinGame, leaveTable, move} from "../playing/";
import { signUp } from "../sinUP";
 
const handleEvent=(socket:Socket)=>{
    socket.onAny((eventName:string,data:any)=>{
        logger.info(`REQUEST EVENT NAME: ${eventName} : REQUEST DATA : ${JSON.stringify(data.data)}`);
        switch(eventName){
            case EVENT_NAME.SIGN_UP:
                signUp(data,socket);
            break;
            case EVENT_NAME.CHECK_POSSIBILITY:
                checkPOssibility(data,socket);
            break;
            case EVENT_NAME.MOVE:   
                move(data,socket);
            break;
            case EVENT_NAME.LEAVE:
                leaveTable(data.data,socket);
            break;
        }
    })
}
export default handleEvent;