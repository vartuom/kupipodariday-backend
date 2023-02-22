import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { WishesModule } from "./wishes/wishes.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { OffersModule } from "./offers/offers.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { HashModule } from "./hash/hash.module";
import configuration from "./configuration/configuration";
import { getDbConfig } from "./configuration/DBConfigFactory";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        // получаем параметры соединения из фабрики
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getDbConfig,
        }),
        UsersModule,
        WishesModule,
        WishlistsModule,
        OffersModule,
        AuthModule,
        HashModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
