import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    // не забыть импортировать модули, откуда пришли эти сервисы!
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    //валидируем по паролю через локальную стратегию
    validateUser(email: string, password: string) {
        const user = this.usersService.findByEmail(email);
        if (user && user.password === password) {
            // исключаем пароль из ответа
            const { password, ...restUserProps } = user;
            //юзер улетает в локальнную стратегию
            return restUserProps;
        }
        return null;
    }

    login(email: string) {
        const payload = { email };
        return { access_token: this.jwtService.sign(payload) };
    }
}
