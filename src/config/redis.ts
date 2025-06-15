import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL,
});
console.log('Redis client created with URL:', process.env.REDIS_URL);
// Connect to Redis
redisClient.connect().catch(console.error);

// Handle connection errors
redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default redisClient;