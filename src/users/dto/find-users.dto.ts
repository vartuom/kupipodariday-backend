import { IsString, Length } from "class-validator";

export class FindUsersDto {
    @IsString()
    @Length(1)
    query: string;
}
