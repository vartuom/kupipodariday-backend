import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Wish } from "../wishes/entities/wish.entity";
import { Wishlist } from "../wishlists/entities/wishlist.entity";
import { Offer } from "../offers/entities/offer.entity";

export const getDbConfig = (
    configService: ConfigService,
): TypeOrmModuleOptions => {
    return {
        type: "postgres",
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: configService.get("database.synchronize"),
    };
};
