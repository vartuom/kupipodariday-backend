import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class CreateOfferDto {
    @IsNumber()
    itemId: number;

    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsBoolean()
    @IsOptional()
    hidden: boolean;
}
