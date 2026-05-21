// server/src/config/redis.js
// Complete working version - NO Redis installation required

class MockRedis {
  constructor() {
    this.store = new Map();
    this.expiry = new Map();
  }

  async get(key) {
    if (this.expiry.has(key) && this.expiry.get(key) < Date.now()) {
      this.store.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.store.get(key) || null;
  }

  async set(key, value, ...args) {
    this.store.set(key, value);
    return 'OK';
  }

  async setex(key, seconds, value) {
    this.store.set(key, value);
    this.expiry.set(key, Date.now() + (seconds * 1000));
    return 'OK';
  }

  async setexAsync(key, seconds, value) {
    return this.setex(key, seconds, value);
  }

  async del(key) {
    this.store.delete(key);
    this.expiry.delete(key);
    return 1;
  }

  async expire(key, seconds) {
    this.expiry.set(key, Date.now() + (seconds * 1000));
    return 1;
  }

  async ttl(key) {
    if (!this.expiry.has(key)) return -2;
    const remaining = Math.ceil((this.expiry.get(key) - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async incr(key) {
    const current = parseInt(await this.get(key)) || 0;
    const newValue = current + 1;
    await this.set(key, newValue.toString());
    return newValue;
  }

  async decr(key) {
    const current = parseInt(await this.get(key)) || 0;
    const newValue = current - 1;
    await this.set(key, newValue.toString());
    return newValue;
  }

  async exists(key) {
    const value = await this.get(key);
    return value !== null ? 1 : 0;
  }

  async hset(key, field, value) {
    let hash = this.store.get(key);
    if (!hash) {
      hash = new Map();
      this.store.set(key, hash);
    }
    hash.set(field, value);
    return 1;
  }

  async hget(key, field) {
    const hash = this.store.get(key);
    return hash ? hash.get(field) || null : null;
  }

  async hdel(key, field) {
    const hash = this.store.get(key);
    if (hash) {
      return hash.delete(field) ? 1 : 0;
    }
    return 0;
  }

  async hgetall(key) {
    const hash = this.store.get(key);
    if (!hash) return {};
    const result = {};
    for (const [field, value] of hash) {
      result[field] = value;
    }
    return result;
  }

  async flushall() {
    this.store.clear();
    this.expiry.clear();
    return 'OK';
  }

  on() {
    return this;
  }

  quit() {
    return Promise.resolve();
  }
}

let redisClient = null;
let isRedisAvailable = false;

const initializeRedis = async () => {
  // Check if Redis is disabled via environment variable
  if (process.env.REDIS_DISABLED === 'true') {
    console.log('⚠️ Redis is DISABLED - using in-memory mock mode');
    redisClient = new MockRedis();
    isRedisAvailable = false;
    return redisClient;
  }

  // Try to connect to real Redis if available
  try {
    const Redis = require('ioredis');
    
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('⚠️ Redis connection failed, falling back to mock mode');
          return null;
        }
        return Math.min(times * 100, 1000);
      },
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
    });

    // Set a timeout for connection attempt
    const timeout = setTimeout(() => {
      console.log('⚠️ Redis connection timeout, using mock mode');
      if (redisClient) {
        redisClient.disconnect();
      }
      redisClient = new MockRedis();
      isRedisAvailable = false;
    }, 2000);

    await redisClient.connect();
    clearTimeout(timeout);
    
    console.log('✅ Redis Connected');
    isRedisAvailable = true;
  } catch (error) {
    console.log('⚠️ Redis not available - using in-memory mock mode');
    redisClient = new MockRedis();
    isRedisAvailable = false;
  }
  
  return redisClient;
};

const isRedisWorking = () => isRedisAvailable && redisClient && !(redisClient instanceof MockRedis);

// Initialize immediately but don't block
initializeRedis().catch(console.error);

// Export a client that works whether Redis is available or not
module.exports = { 
  redisClient: (() => {
    // Create a proxy that will return the real client when ready
    let client = null;
    const getClient = () => {
      if (!client) {
        client = redisClient || new MockRedis();
      }
      return client;
    };
    return new Proxy({}, {
      get: (target, prop) => {
        const actualClient = getClient();
        const value = actualClient[prop];
        if (typeof value === 'function') {
          return value.bind(actualClient);
        }
        return value;
      }
    });
  })(),
  initializeRedis,
  isRedisWorking,
  MockRedis
};