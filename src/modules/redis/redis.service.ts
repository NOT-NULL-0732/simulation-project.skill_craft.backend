import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  redis: Redis;

  constructor() {
    this.redis = new Redis({
      port: 6379,
      host: '192.168.1.51',
      password: 'redis_3tASHP',
    });
    this.redis.on('connect', () => {
      Logger.verbose('Redis已连接');
    });
  }
}
