import { Module } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';

@Module({
  providers: [BitcoinService],
  controllers: [BitcoinController]
})
export class BitcoinModule {}
