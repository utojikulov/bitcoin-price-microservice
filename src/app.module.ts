import { Module } from '@nestjs/common'
import { MyConfigModule } from './config/config.module'
import { RedisModule } from './redis/redis.module';
import { BinanceApiModule } from './binance-api/binance-api.module';
import { CryptoAssetModule } from './crypto-asset/crypto-asset.module';

@Module({
    imports: [
        CryptoAssetModule,
        MyConfigModule,
        RedisModule,
        BinanceApiModule
    ],
})

export class AppModule {}
