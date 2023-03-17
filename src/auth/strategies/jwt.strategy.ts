import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private configService: ConfigService,
    ) {
        // вытаскиваем Bearer токен из Auth заголовка
        super({
            secretOrKey: configService.get("jwt.secret"), //
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
