import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { RedisService } from '../redis/redis.service';
import { BitcoinService } from './bitcoin.service';

@ApiTags('Bitcoin Price')
@Controller('bitcoin')
export class BitcoinController {
    constructor(private readonly redisService: RedisService, private readonly bitcoinService: BitcoinService) {}

    @Get('price')
    @ApiOperation({ summary: 'Get current Bitcoin price with commission applied' })
    @ApiOkResponse({
        description: 'Successfully retrieved Bitcoin price data'
    })
    @ApiResponse({
        status: 404,
        description: 'Price data not found in cache (service might be starting up)'
    })
    async getPrice() {
        const priceData = await this.redisService.getValueFromHash('btc:price', 'latest')

        if (!priceData) {
            throw new NotFoundException('Price data not available.')
        }

        return priceData
    }
}
