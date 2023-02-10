import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { WishesModule } from "./wishes/wishes.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { OffersModule } from "./offers/offers.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeOrmConfig from "./utils/typeOrmConfig";

@Module({
    imports: [
        UsersModule,
        WishesModule,
        WishlistsModule,
        OffersModule,
        TypeOrmModule.forRoot(typeOrmConfig),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
