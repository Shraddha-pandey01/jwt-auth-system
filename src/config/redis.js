const { createClient } = require('redis')
require('dotenv').config()

const redisClient = createClient({
    url : process.env.REDIS_URI
})

redisClient.connect()

redisClient.on('connect', () => {
    console.log('Redis is connected')
})

redisClient.on('error', (err) => {
    console.error(err)
})

module.exports = redisClient
