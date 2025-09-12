import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redisClient: Redis

    constructor(private readonly configService: ConfigService) {
        this.redisClient = new Redis({
            password: process.env.REDIS_PASSWORD,
            port: 6388
        })
        this.redisClient.on('connect', () => {
            console.log('Connected to Redis');
        });

        this.redisClient.on('error', (error) => {
            console.error('Redis error:', error);
        });
    }
}
