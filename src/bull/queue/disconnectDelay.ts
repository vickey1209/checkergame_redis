import Queue from 'bull';
import dotenv from 'dotenv';
import { BULL_KEY } from '../../constants';
import { disconnect } from '../../playing';
import logger from '../../logger';
dotenv.config({path:'../../../.env'});
export async function disconnectQueue(tableId:string){
   try {
    if(tableId){

    let redisOption:any={
        port:process.env.REDIS_PORT,
        host:process.env.REDIS_HOST,
        db:process.env.REDIS_DB
    }
    let disconnectDelayQueue=new Queue(BULL_KEY.DISCONNECT_DELAY_QUEUE,{redis:redisOption});

    let options={
        delay:2000,
        attempts:1,
        job_id:tableId
    }

    await disconnectDelayQueue.add(tableId,options);
    await disconnectDelayQueue.process(async (job:any)=>{
        console.log('job',job);
        // await disconnect(job.tableId);
    })
   }
   } catch (error) {
        logger.error(`CATCH ERROR IN disconnectQueue : ${error}`)
   }
}