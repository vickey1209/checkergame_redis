import Queue from 'bull';
import { BULL_KEY, EVENT_NAME, REDIS_KEY } from '../../constants';
import dotenv from 'dotenv';
import Event from '../../eventEmitter';
import { userTurnStartValidation } from '../../validation/responseValidation';
import logger from '../../logger';
import { Get } from '../../redisOperation';
import { GameDelayInterface } from '../../interface/otherInterface';
import Table from '../../interface/tableInterface';

dotenv.config({path:"../../../.env"})
const turnDelay = async (data:GameDelayInterface)=>{
try {
    
    let redisData:any={
        port:process.env.REDIS_PORT,
        host:process.env.REDIS_HOST,
        db:process.env.REDIS_DB,
    }
    let turnDelayQueue=new Queue(BULL_KEY.TURN_DELAY_QUEUE,{redis:redisData});
    let option={
        delay:data.delayTime,
        attempts:data.attempts,
        job_id:data.jobId
    }
    await turnDelayQueue.add(data,option);
    await turnDelayQueue.process(async (job:any)=>{
        let tableData:Table= await Get(`${REDIS_KEY.REDIS_TABLE}:${job.data.jobId}`);
        let userTurnStartData={
            eventName:EVENT_NAME.USER_TURN_START,
            data:{
                userId:tableData.turnId,
            }
        }
        let validateUserTurnStartData=await userTurnStartValidation(userTurnStartData)
        await Event.sendToRoom(job.data.jobId,validateUserTurnStartData);
    })
} catch (error) {
    logger.error(`CATCH ERROR IN turnDelay : ${error}`)
}
}

export default turnDelay;