import { EVENT_NAME, REDIS_KEY } from "../constants";
import Table from "../interface/tableInterface";
import logger from "../logger";
import { Get } from "../redisOperation";
import {disconnect} from ".";
import Event from '../eventEmitter';

export async function leaveTable(data:{userId:string},socket:any){
    try {
        console.log('data', data)
        let tableData:Table|null=await Get(`${REDIS_KEY.REDIS_TABLE}:${socket.tableId}`);
        console.log('tableData', tableData)
        if(tableData){
                let winData={
                    eventName:EVENT_NAME.WIN,
                    data:{
                        winnerId:(tableData.player[0]._id==data.userId)?tableData.player[1]._id:tableData.player[0]._id
                    }
                }
                Event.sendToRoom(tableData._id,winData);
                disconnect(socket.tableId);
        }
    } catch (error) {
        logger.error(`CATCH ERROR IN liveTable : ${error}`)
    }
}