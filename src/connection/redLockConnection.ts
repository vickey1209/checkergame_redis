import Redlock from 'redlock'; 
import { redis } from './redisConnection';

const redLock = new Redlock([redis],{ 
    driftFactor: 0.01,
    retryCount: 10,
    retryJitter: 200,
    automaticExtensionThreshold: 500,
})

export default redLock;