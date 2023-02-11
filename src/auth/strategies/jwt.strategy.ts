import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        // вытаскиваем Bearer токен из Auth заголовка
        super({
            secretOrKey: "gayfish", // надо потом не забыть спрятать
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    // в пэйлоад приходит ровно то, что было зашифровано в методе login сервиса auth
    // а именно const payload = { email };
    // стратегия сама извлекает содержимое и передает в Req в виде объекта { email: payload.email }
    async validate(payload: any) {
        const user = payload;
        return user;
    }
}
