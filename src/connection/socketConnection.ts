import { Socket } from 'socket.io';
import {io} from '..';
import {createAdapter} from 'socket.io-redis';
import { redisPub, redisSub } from './redisConnection';
import handleEvent from '../eventHandler';
import { disconnect } from '../playing';
import { disconnectQueue } from '../bull/queue/disconnectDelay';
const socketIoConnection=()=>{
    io.adapter(createAdapter(redisPub,redisSub));
    io.on('connection',async(socket:any)=>{
       await handleEvent(socket);
       socket.on('disconnect',async()=>{
        await disconnectQueue(socket.tableId);
        // disconnect(socket);
       })
    })
}

export default socketIoConnection;