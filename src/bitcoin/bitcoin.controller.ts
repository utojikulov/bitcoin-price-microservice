import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RedisService } from 'src/redis/redis.service';
import { BitcoinService } from './bitcoin.service';

@ApiTags('Bitcoin Price')
@Controller('bitcoin')
export class BitcoinController {
    constructor(private readonly redisService: RedisService, private readonly bitcoinService: BitcoinService) {}

    @Get('price')
    @ApiOperation({ summary: 'Get current Bitcoin price with commission applied' })
    async getPrice() {
        return await this.redisService.getValueFromHash('btc:price', 'latest')
    }

    @Get('test')
    async test() {
        return this.bitcoinService.getPriceData()
    }
}
