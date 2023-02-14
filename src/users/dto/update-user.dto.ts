import { IsEmail, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @Length(2, 30)
    @IsOptional()
    username: string;

    @IsString()
    @Length(2, 200)
    @IsOptional()
    about: string;

    @IsUrl()
    @IsOptional()
    avatar: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}
