import { redis } from "../connection/redisConnection";

const Get=async (key:string)=>{
    let data:any=await redis.get(key);
    data=(data)?JSON.parse(data):null;
    return data;
};
const Set=async (key:string,data:any)=>{
    return await redis.set(key,JSON.stringify(data));
};
const Del=async (key:string)=>{
    return await redis.del(key);
};


export {Get , Set, Del};