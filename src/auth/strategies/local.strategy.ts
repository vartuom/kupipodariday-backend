import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { User } from "../../users/entities/user.entity";

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
        super({ usernameField: "username", passwordField: "password" });
    }

    // метод validate основа логики стратегий
    async validate(
        username: string,
        password: string,
    ): Promise<Omit<User, "password">> {
        //if (!email || !password) throw new BadRequestException("Необходимо передать пароль и email.");
        const user = await this.authService.validateUser(username, password);
        // если все ОК то объект пользователя улетает в Req запроса
        return user;
    }
}
