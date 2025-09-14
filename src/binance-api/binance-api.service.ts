import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface BinanceOrderBookTickerResponse {
    symbol: string
    bidPrice: string
    bidQty: string
    askPrice: string
    askQty: string
}

@Injectable()
export class BinanceApiService {
    private readonly url = 'https://api.binance.com/api/v3'
    private readonly logger = new Logger(BinanceApiService.name)

    async orderBookTicker(symbol: string): Promise<BinanceOrderBookTickerResponse> {
        try {
            const response = await axios.get<BinanceOrderBookTickerResponse>(
                `${this.url}/ticker/bookTicker`,
                { params: {symbol}}
            )

            return response.data
        } catch (error) {
            this.logger.error('Binance API error for symbol: ${symbol}', error)
            throw new BadGatewayException('An error occcured while fetching Binance order book ticker')
        }
    }
}
