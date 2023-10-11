import { io } from "..";
import logger from "../logger";


class Event{
     sendToSocket(socketId:string,data:any) {
        logger.info(`sendToSocket : RESPONSE EVENT NAME : ${data.eventName} : RESPONSE DATA : ${JSON.stringify(data.data)}`)
        io.to(socketId).emit(data.eventName,data);
    }
    sendToRoom(tableId:string,data:any){
        logger.info(`sendToRoom : RESPONSE EVENT NAME : ${data.eventName} : RESPONSE DATA : ${JSON.stringify(data.data)}`);
        io.to(tableId).emit(data.eventName,data);
    }
}

export = new Event();