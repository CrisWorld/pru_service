import { createClient } from 'redis';
import { ENV } from './env';
console.log('Redis client created with URL:', ENV.REDIS_URI);
const redisClient = createClient({
    url: ENV.REDIS_URI,
});
// Connect to Redis
redisClient.connect().catch(console.error);

// Handle connection errors
redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default redisClient;
