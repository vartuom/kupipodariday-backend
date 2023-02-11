import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 1. гарда перехватывает запрос
    // 2. тригерит соответствующую стратегию
    // 3. стратегия вызывает собственный метод validate
    // 4. в котором вызывается логика валидация пользователя из auth сервиса
    // 5. auth сервис обращается к сервису user
    // 6. user ищет в базе пользователя по имени и возвращает объект пользователя
    // 7. все укатывается обратно в стратегию,
    // 8. которая при успехе валидация добавляет пришедший объект пользователя в Request
    // 9. в контроллер приходит объект запроса с пользователем из БД (req.user)
    // ...
    // n. profit!
    @UseGuards(LocalAuthGuard)
    @Post("signin")
    signin(@Request() req) {
        // на базе полученного объекта пользователя создаем JWT
        return this.authService.login(req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Get("protected")
    getHello(@Request() req) {
        return `Hello, ${req.user.email}!`;
    }
}
