import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "./entities/user.entity";
import { FindUsersDto } from "./dto/find-users.dto";

// все ручки контроллера спрятаны за jwt гардой - все получают на вход Req {user}
// НЕ АКТУАЛЬНО - @UseInterceptors(ClassSerializerInterceptor) убирает из респонсов все поля сущностей,
// помеченные декоратором @Exclude (например, password)
// https://stackoverflow.com/questions/50360101/how-to-exclude-entity-field-from-returned-by-controller-json-nestjs-typeorm
@UseGuards(JwtAuthGuard)
// @UseInterceptors(ClassSerializerInterceptor)
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    getCurrentUser(@Req() { user }: { user: Omit<User, "password"> }) {
        return this.usersService.findOneByIdOrFail(user.id);
    }

    @Get("me/wishes")
    getMyWishes(@Req() { user }: { user: Omit<User, "password"> }) {
        return this.usersService.getUserWishes(user.username);
    }

    @Get(":username/wishes")
    getAnotherUserWishes(@Param("username") username: string) {
        return this.usersService.getUserWishes(username);
    }

    @Get(":username")
    findOne(@Param("username") username: string) {
        return this.usersService.findOneByNameOrFail(username);
    }

    @Post("find")
    async findUsers(@Body() findUsersDto: FindUsersDto) {
        return await this.usersService.findMany(findUsersDto);
    }

    @Patch("me")
    async updateCurrentUser(
        @Req() { user }: { user: Omit<User, "password"> },
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(user.id, updateUserDto);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
