import { Module } from '@nestjs/common'
import { BitcoinModule } from './bitcoin/bitcoin.module'
import { MyConfigModule } from './config/config.module'
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
        BitcoinModule,
        MyConfigModule,
        RedisModule
    ],
})

export class AppModule {}
