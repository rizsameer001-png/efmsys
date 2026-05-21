// server/src/config/redis.js
// Simple in-memory mock - No Redis required

class MemoryStore {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value) {
    this.store.set(key, value);
    return 'OK';
  }

  async setex(key, seconds, value) {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key) {
    this.store.delete(key);
    return 1;
  }

  on() {
    return this;
  }

  quit() {
    return Promise.resolve();
  }
}

const redisClient = new MemoryStore();
const isRedisAvailable = false;

const initializeRedis = async () => {
  console.log('📦 Using in-memory storage (Redis disabled)');
  return redisClient;
};

const isRedisWorking = () => false;

module.exports = { 
  redisClient,
  initializeRedis,
  isRedisWorking
};