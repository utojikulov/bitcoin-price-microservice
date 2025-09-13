import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinController } from './bitcoin.controller';
import { RedisService } from '../redis/redis.service';
import { afterEach } from 'node:test';
import { BitcoinService } from './bitcoin.service';
import { NotFoundException } from '@nestjs/common';

describe('BitcoinController', () => {
    let controller: BitcoinController;
    let redisService: RedisService

    const mockBitcoinService ={
        getPriceData: jest.fn()
    }

    const mockRedisService = {
        getValueFromHash: jest.fn()
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BitcoinController],
            providers: [
                {
                    provide: BitcoinService,
                    useValue: mockBitcoinService
                },
                {
                    provide: RedisService,
                    useValue: mockRedisService
                }
            ]
        }).compile();

        controller = module.get<BitcoinController>(BitcoinController);
        redisService = module.get<RedisService>(RedisService);
    });
    
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getPrice', () => {
        it('should return price data applied with commission from Redis if available', async () => {
            const mockData= JSON.stringify({
                bid: 115894.29,
                ask: 115917.48,
                midPrice: 115905.89,
                ts: 1757796064697
            })

            mockRedisService.getValueFromHash.mockResolvedValue(mockData)

            const result = await controller.getPrice()

            expect(redisService.getValueFromHash).toHaveBeenCalledWith('btc:price', 'latest')
            expect(result).toEqual(mockData)
        })

        it('should throw NotFoundException error if no prica data found', async () => {
            mockRedisService.getValueFromHash.mockResolvedValue(null)

            await expect(controller.getPrice()).rejects.toThrow(NotFoundException)
            expect(redisService.getValueFromHash).toHaveBeenCalledWith('btc:price', 'latest')
        })
    })
});
