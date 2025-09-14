import { ApiProperty } from "@nestjs/swagger"

export class CryptoAssetEntity {
    @ApiProperty({ description: 'bid price wih commission applied', nullable: false })
    bid: number 

    @ApiProperty({ description: 'ask price with commission applied', nullable: false })
    ask: number

    @ApiProperty({ description: 'mid price', nullable: false })
    midPrice: number

    @ApiProperty({ description: 'timestamop', nullable: false })
    ts: number
}
