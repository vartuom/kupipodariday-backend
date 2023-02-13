import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { HashModule } from "../hash/hash.module";

@Module({
    // из модулей users, passport, hash и jwt используем сервисы, поэтому модули закидываем в импорт
    // для авторизации используем паспорт
    imports: [
        UsersModule,
        PassportModule,
        HashModule,
        JwtModule.register({
            secret: "gayfish", // не забыть спрятать!
            signOptions: { expiresIn: "600s" },
        }),
    ],
    // стратегии тоже провайдеры, не забываем закинуть их в массив
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
