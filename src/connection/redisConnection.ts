import Client from 'ioredis';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import logger from '../logger';
dotenv.config({path:'../../.env'})
    let redisOptions:any={
        port:process.env.REDIS_PORT,
        host:process.env.REDIS_HOST,
        db:process.env.REDIS_DB,
    }
    let redis=new Client(redisOptions);

    redis.on('connect',()=>{
        logger.info('redis connected successfully');
        redis.flushdb();
    })
    let redisPub:any=new IORedis(redisOptions);
    let redisSub:any=new IORedis(redisOptions);

    redisPub.on('connect',()=>{
        logger.info('redisPub connected successfully ');
    })
    redisSub.on('connect',()=>{
        logger.info('redisSub connected successfully ');
    })
    redisPub.on('error',(error:any)=>{
        logger.error('redisPub connection error : ',error)
    })
    redisSub.on('error',(error:any)=>{
        logger.error('redisPub connection error : ',error)
    })
export { redis,redisPub,redisSub}
