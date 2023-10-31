const redis = require('redis')
const apicache = require('apicache')
const config = require('config')

const apiCacheWithRedis = apicache.options({
    redisClient: redis.createClient({
        port: 6379,
        host: "0.0.0.0",
        // auth: config.get('redis.password')
    }),
    statusCodes: {
        include: [200]
    }
}).middleware

module.exports = { apicache, apiCacheWithRedis }
