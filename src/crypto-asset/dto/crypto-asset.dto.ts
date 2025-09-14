import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CryptoAssetDto {
    @IsNotEmpty()
    @IsNumber()
    bid: number 

    @IsNotEmpty()
    @IsNumber()
    ask: number

    @IsNotEmpty()
    @IsNumber()
    midPrice: number

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ts: number

}
