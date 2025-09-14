import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Crypto Asset')
@Controller('crypto')
export class CryptoAssetController {
    private readonly targetSymbol: string

    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService
    ) {}

    @Get('price')
    @ApiOperation({ summary: 'Get current crypto asset price with commission applied' })
    @ApiOkResponse({
        description: 'Successfully retrieved price data'
    })
    @ApiResponse({
        status: 404,
        description: 'Price data not found in cache'
    })
    async getPrice(@Query('symbol') symbol: string) {
        const targetSymbol = symbol || this.configService.get<string>('app.target_symbol')
        const priceData = await this.redisService.getValueFromHash(
            `binance:${this.targetSymbol}:orderBookTicker`,
            'latest'
        )

        if (!priceData) throw new NotFoundException('Price data not available.')

        return JSON.parse(priceData)
    }
}
