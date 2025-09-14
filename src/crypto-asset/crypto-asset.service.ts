import { BadGatewayException, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { BinanceApiService } from 'src/binance-api/binance-api.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

export interface PriceData {
    bid: number
    ask: number
    midPrice: number
    ts: number
}

@Injectable()
export class CryptoAssetService implements OnModuleInit {
    private readonly logger = new Logger(CryptoAssetService.name);
    private readonly commission: number
    private readonly updateInterval: number
    private readonly targetSymbol: string

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly binanceApiService: BinanceApiService
    ) {
        this.commission = Number(this.configService.get<number>('app.service_commission_rate')!)
        this.updateInterval = Number(this.configService.get<number>('app.update_freq_ms')!)
        this.targetSymbol= this.configService.get<string>('app.target_symbol')!
    }

    onModuleInit() {
        this.getPriceData()
        setInterval(() => this.getPriceData(), this.updateInterval)
    }

    async getPriceData() {
        try {
            this.logger.log(`Fetching data for: ${this.targetSymbol}>>>>`)

            const { bidPrice, askPrice } = await this.binanceApiService.orderBookTicker(this.targetSymbol)

            if (!bidPrice || !askPrice) {
                throw new BadGatewayException('Invalid response from Binance API')
            }

            const bid = parseFloat(bidPrice)
            const ask = parseFloat(askPrice)

            const bidFee = bid * (1 - this.commission)
            const askFee = ask * (1 + this.commission)
            const midPrice = (bidFee + askFee) / 2

            const rounded = (n: number) => Math.round(n * 100) / 100

            const payload: PriceData = {
                bid: rounded(bidFee),
                ask: rounded(askFee),
                midPrice: rounded(midPrice),
                ts: Date.now()
            }

            await this.redisService.setValueToHash(
                `binance:${this.targetSymbol}:orderBookTicker`,
                'latest',
                JSON.stringify(payload)
            )
            this.logger.log(`${this.targetSymbol} price updated: ${JSON.stringify(payload)}`)
        } catch (error) {
            this.logger.error('Error occured while fetching price data', error)
        }
    }

}
