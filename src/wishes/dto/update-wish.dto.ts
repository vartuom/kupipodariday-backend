import {
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Min,
} from "class-validator";

export class UpdateWishDto {
    @IsString()
    @Length(1, 250)
    @IsOptional()
    name: string;

    @IsUrl()
    @IsOptional()
    link: string;

    @IsUrl()
    @IsOptional()
    image: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    price: number;

    @IsString()
    @Length(1, 1024)
    @IsOptional()
    description: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    copied?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    raised?: number;
}
