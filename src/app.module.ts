import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { WishesModule } from "./wishes/wishes.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { OffersModule } from "./offers/offers.module";

@Module({
    imports: [UsersModule, WishesModule, WishlistsModule, OffersModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
