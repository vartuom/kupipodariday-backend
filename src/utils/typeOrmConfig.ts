import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { User } from "../users/entities/user.entity";
import { Offer } from "../offers/entities/offer.entity";
import { Wish } from "../wishes/entities/wish.entity";
import { Wishlist } from "../wishlists/entities/wishlist.entity";

const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "student",
    password: "student",
    database: "kupipodariday",
    entities: [User, Offer, Wish, Wishlist],
    synchronize: true,
};

export default typeOrmConfig;
