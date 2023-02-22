import {
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    // 1. гарда перехватывает запрос
    // 2. тригерит соответствующую стратегию
    // 3. стратегия вызывает собственный метод validate
    // 4. в котором вызывается логика валидация пользователя из auth сервиса
    // 5. auth сервис обращается к сервису user
    // 6. user ищет в базе пользователя по имени и возвращает объект пользователя
    // 7. все укатывается обратно в стратегию,
    // 8. которая при успехе валидации добавляет пришедший объект пользователя в Request
    // 9. в контроллер приходит объект запроса с пользователем из БД (req.user)
    // ...
    // n. profit!
    @UseGuards(LocalAuthGuard)
    @Post("signin")
    // декомпозируем req, достаем объект пользователя
    signin(@Request() { user }) {
        // на базе полученного объекта пользователя создаем JWT
        // возвращаем на кликент объект с токеном, в токен записываем только id
        return this.authService.login(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("protected")
    getHello(@Request() { user }) {
        return `Hello, ${user.username}!`;
    }

    @Post("signup")
    async signup(@Body() createUserDto: CreateUserDto) {
        // для валидации полей DTO не забыть подключить ValidationPipe в main.ts!
        return this.userService.create(createUserDto);
    }
}
