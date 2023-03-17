import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { HashModule } from "../hash/hash.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    // из модулей users, passport, hash и jwt используем сервисы, поэтому модули закидываем в импорт
    // для авторизации используем паспорт
    imports: [
        UsersModule,
        PassportModule,
        HashModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("jwt.secret"),
                signOptions: { expiresIn: configService.get("jwt.expiresIn") },
            }),
        }),
    ],
    // стратегии тоже провайдеры, не забываем закинуть их в массив
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
