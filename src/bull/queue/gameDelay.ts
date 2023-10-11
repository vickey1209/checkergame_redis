import Queue from 'bull';
import { BULL_KEY, EVENT_NAME } from '../../constants';
import dotenv from 'dotenv';
import Event from '../../eventEmitter';
import turnDelay from './turnDelay';
import logger from '../../logger';
import { GameDelayInterface } from '../../interface/otherInterface';
dotenv.config({path:'../../../.env'});

const delayGame =async (data:GameDelayInterface)=>{
    try {
        let redisOption:any={
            port:process.env.REDIS_PORT,
            host:process.env.REDIS_HOST,
            db:process.env.REDIS_DB
        }
        let gameDelayQueue=new Queue(BULL_KEY.GAME_DELAY_QUEUE,{redis:redisOption});
        let option={
            attempts:data.attempts,
            delay:data.delayTime,
            job_id:data.jobId
        }
        await gameDelayQueue.add(data,option);
        await gameDelayQueue.process(async (job:any)=>{

            let gameStartData={
                eventName:EVENT_NAME.START_GAME,
                data:{
                    message:"start Game",
                    userId:job.data.userId
                }
            }
            
            await Event.sendToRoom(job.data.jobId,gameStartData);
            let turnDelayData:GameDelayInterface={
                userId:job.data.userId,
                delayTime:2000,
                attempts:1,
                jobId:job.data.jobId
            }
            await turnDelay(turnDelayData);
        })
    } catch (error) {
        logger.error(`CATCH ERROR IN delayGame : ${error}`);
    }
}
export default delayGame;