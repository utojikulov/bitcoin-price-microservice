import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BitcoinModule } from './bitcoin/bitcoin.module'
import { MyConfigModule } from './config/config.module'

@Module({
    imports: [
        BitcoinModule,
        MyConfigModule
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}
