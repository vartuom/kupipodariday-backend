import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        // вытаскиваем Bearer токен из Auth заголовка
        super({
            secretOrKey: "gayfish", // надо потом не забыть спрятать
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    // в пэйлоад приходит ровно то, что было зашифровано в методе login сервиса auth
    // а именно const payload = { email };
    async validate({ email }: { email: string }) {
        const user = await this.userService.findOneByEmailOrFail(email);
        // убираем хэш пароля из объекта
        const { password, ...restUserProps } = user;
        // стратегия передает в Req объект user
        return restUserProps;
    }
}
