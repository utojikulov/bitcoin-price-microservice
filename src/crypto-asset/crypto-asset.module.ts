import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { CryptoAssetService } from './crypto-asset.service';
import { CryptoAssetController } from './crypto-asset.controller';
import { BinanceApiModule } from 'src/binance-api/binance-api.module';

@Module({
    providers: [CryptoAssetService],
    controllers: [CryptoAssetController],
    imports: [RedisModule, BinanceApiModule],
    exports: [CryptoAssetService]
})
export class CryptoAssetModule {}
