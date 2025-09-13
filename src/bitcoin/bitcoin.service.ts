import { BadGatewayException, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisService } from '../redis/redis.service';

export interface PriceData {
    bid: number
    ask: number
    midPrice: number
    ts: number
}

@Injectable()
export class BitcoinService implements OnModuleInit {
    private readonly logger = new Logger(BitcoinService.name);
    private readonly comission: number
    private readonly updateInterval: number
    private readonly binanceApi: string
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
    ) {
        this.comission = Number(this.configService.get<number>('app.service_commission_rate')!)
        this.updateInterval = Number(this.configService.get<number>('app.update_freq_ms')!)
        this.binanceApi = this.configService.get<string>('app.binance_api')!
    }

    onModuleInit() {
        this.getPriceData()
        setInterval(() => this.getPriceData(), this.updateInterval)
    }

    async getPriceData() {
        try {
            this.logger.log('Fetching data from Binance API>>>>')
            const response = await axios.get(this.binanceApi)

            const { bidPrice, askPrice } =  response.data

            if (!bidPrice || !askPrice) {
                throw new BadGatewayException('Invalid response from Binance API')
            }

            const bid = parseFloat(bidPrice)
            const ask = parseFloat(askPrice)

            const bidFee = bid * (1 - this.comission)
            const askFee = ask * (1 + this.comission)
            const midPrice = (bidFee + askFee) / 2

            const rounded = (n) => {
                return Math.round(n * 100) / 100
            }

            const payload: PriceData = {
                bid: rounded(bidFee),
                ask: rounded(askFee),
                midPrice: rounded(midPrice),
                ts: Date.now()
            }

            await this.redisService.setValueToHash('btc:price', 'latest', JSON.stringify(payload))

            this.logger.log(`BTC price has been updated: ${JSON.stringify(payload)}`)
        } catch (error) {
            this.logger.error('Error occured while fetching BTC price', error)
        }
    }

}
