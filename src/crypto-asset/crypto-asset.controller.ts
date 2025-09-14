import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { CryptoAssetDto } from './dto/crypto-asset.dto';
import { CryptoAssetEntity } from './entities/crypto-asset.entity';

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
    @ApiQuery({
        name: 'symbol',
        type: String,
        required: true,
        example: 'BTCUSDT'
    })
    @ApiOkResponse({
        description: 'Successfully retrieved price data',
        type: CryptoAssetEntity,
        schema: {
            example: {
                "bid": 116070.28,
                "ask": 116093.51,
                "midPrice": 116081.9,
                "ts": 1757886385155
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Price data not found in cache',
    })
    async getPrice(@Query('symbol') symbol: string): Promise<CryptoAssetDto> {
        const targetSymbol = symbol || this.configService.get<string>('app.target_symbol')
        const priceData = await this.redisService.getValueFromHash(
            `binance:${targetSymbol}:orderBookTicker`,
            'latest'
        )

        if (!priceData) throw new NotFoundException('Price data not available.')

        return priceData
    }
}
