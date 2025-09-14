import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfig } from '@/common/config/index.config';

@Injectable()
export class RedisService {
  redis: Redis;

  constructor() {
    this.redis = new Redis({
      port: AppConfig.redis.port,
      host: AppConfig.redis.host,
      password: AppConfig.redis.password,
    });
    this.redis.on('connect', () => {
      Logger.verbose('Redis已连接');
    });
  }
}
