import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

// с точки зрения неста стратегия это провайдер не забываем про Injectable
@Injectable()
// стратегию "Strategy" берем из "passport-local"
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        // Для локальной стратегии ничего в конфиге не нужно.
        // Но, по-умолчанию, если в `LocalStrategy` не передавать никаких опций
        // — стратегия будет искать параметры для авторизации пользователя в полях
        // с именами `username` и `password`.
        // При желании, можно указать свои имена полей:
        super({ usernameField: "email", passwordField: "password" });
    }

    // метод validate основа логики почти всех стратегий
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) throw new UnauthorizedException();
        // если все ОК то объект пользователя улетает в Req запроса
        return user;
    }
}
