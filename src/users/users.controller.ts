import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    NotFoundException,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "./entities/user.entity";
import { FindUsersDto } from "./dto/find-users.dto";

// все ручки контроллера спрятаны за jwt гардой - все получают на вход Req {user}
// @UseInterceptors(ClassSerializerInterceptor) убирает из респонсов все поля сущностей,
// помеченные декоратором @Exclude (например, password)
// https://stackoverflow.com/questions/50360101/how-to-exclude-entity-field-from-returned-by-controller-json-nestjs-typeorm
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    async getCurrentUser(@Req() { user }: { user: Omit<User, "password"> }) {
        const currentUser = await this.usersService.findOneById(user.id);
        if (!currentUser)
            throw new NotFoundException("Пользователь не существует.");
        return currentUser;
    }

    @Get(":username")
    async findOne(@Param("username") username: string) {
        const user = await this.usersService.findOneByName(username);
        if (!user) throw new NotFoundException("Пользователь не существует.");
        return user;
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
        const { password, ...restUserProps } = await this.usersService.update(
            user.id,
            updateUserDto,
        );
        return restUserProps;
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.usersService.remove(+id);
    }
}
