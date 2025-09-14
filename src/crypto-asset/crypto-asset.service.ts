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

    private intervalId: NodeJS.Timeout | null = null

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
        this.start()
    }

    onModuleDestroy() {
        this.stop()
    }

    start() {
        if (this.intervalId) return true
        this.getPriceData()
        this.intervalId = setInterval(() => this.getPriceData(), this.updateInterval)
        this.logger.log('Price updte interval started.')
        return true

    }

    stop() {
        if (!this.intervalId) return false
        clearInterval(this.intervalId)
        this.intervalId = null
        this.logger.log('Price interval updating stopped')
        return false
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
