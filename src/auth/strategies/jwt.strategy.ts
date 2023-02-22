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
    // а именно const payload = { userId };
    async validate({ userId }: { userId: number }) {
        const user = await this.userService.findOneByIdOrFail(userId);
        // стратегия передает в Req объект user
        return user;
    }
}
