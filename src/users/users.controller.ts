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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "./entities/user.entity";

// все ручки контроллера спрятаны за jwt гардой - все получают на вход Req {user}
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    async getCurrentUser(@Req() { user }: { user: Omit<User, "password"> }) {
        const currentUser = await this.usersService.findOneById(user.id);
        if (!currentUser)
            throw new NotFoundException("Пользователь не существует.");
        // убираем хэш пароля из объекта
        const { password, ...restUserProps } = currentUser;
        return restUserProps;
    }

    @Get(":username")
    async findOne(@Param("username") username: string) {
        const user = await this.usersService.findOneByName(username);
        if (!user) throw new NotFoundException("Пользователь не существует.");
        const { password, ...restUserProps } = user;
        return restUserProps;
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
