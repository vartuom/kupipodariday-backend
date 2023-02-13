import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "../hash/hash.service";

@Injectable()
export class AuthService {
    // не забыть импортировать модули, откуда пришли эти сервисы!
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private hashService: HashService,
    ) {}

    //валидируем по паролю через локальную стратегию
    async validateUser(email: string, plainTextPassword: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user)
            throw new UnauthorizedException(
                "Пользователь с указанным email не существует или пароль не верен.",
            );
        const match = await this.hashService.compare(
            plainTextPassword,
            user.password,
        );
        if (!match)
            throw new UnauthorizedException(
                "Пользователь с указанным email не существует или пароль не верен.",
            );
        // исключаем пароль из ответа
        const { password, ...restUserProps } = user;
        //юзер улетает в локальнную стратегию
        return restUserProps;
    }

    login(email: string) {
        const payload = { email };
        // возвращаем на кликент объект с токеном, в токен записываем только email
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
