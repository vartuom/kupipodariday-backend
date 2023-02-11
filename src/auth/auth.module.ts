import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    // из модулей users и jwt используем сервисы, поэтому модули закидываем в импорт
    // для авторизации используем паспорт
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: "gayfish",
            signOptions: { expiresIn: "60s" },
        }),
    ],
    // стратегии тоже провайдеры, не забываем закинуть их в массив
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
