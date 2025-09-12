import { Module } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    providers: [BitcoinService],
    controllers: [BitcoinController],
    imports: [RedisModule],
    exports: [BitcoinService]
})
export class BitcoinModule {}
