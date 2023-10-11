import http from 'http';
import {Server} from 'socket.io';
import express from 'express';
import dotenv from 'dotenv';
import logger from './logger';
import path from 'path';
import socketIoConnection from './connection/socketConnection';
dotenv.config({path:'./.env'})
const app = express()
const httpServer=http.createServer(app);
const io:Server=new Server(httpServer,{
    cors:{origin:"*"},
    pingInterval:2000,
    pingTimeout:2500,
});

socketIoConnection()

app.use(express.static(path.join(__dirname,'../view')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/game.html'))
})

const port = process.env.SERVER_PORT;
httpServer.listen(port,()=>{
   logger.info(`server is running on port : ${port}`)
})

export  {io};