import {
    ClassSerializerInterceptor,
    Injectable,
    UnauthorizedException,
    UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "../hash/hash.service";
import { WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE } from "../utils/errorConstants";

@Injectable()
export class AuthService {
    // не забыть импортировать модули, откуда пришли эти сервисы!
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private hashService: HashService,
    ) {}

    // валидируем по паролю через локальную стратегию
    // перехватчик убирает пароль и почту из ответа
    @UseInterceptors(ClassSerializerInterceptor)
    async validateUser(username: string, plainTextPassword: string) {
        const user = await this.usersService.findOneForAuthOrFail(username);
        if (!user)
            throw new UnauthorizedException(
                WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE,
            );
        const match = await this.hashService.compare(
            plainTextPassword,
            user.password,
        );
        if (!match)
            throw new UnauthorizedException(
                WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE,
            );
        //юзер улетает в локальнную стратегию
        return user;
    }

    login(userId: number) {
        const payload = { userId };
        // возвращаем на клиент объект с токеном, в токен записываем только userId
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
