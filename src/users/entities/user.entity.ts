import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Unique,
    OneToMany,
} from "typeorm";
import { IsEmail, IsString, IsUrl, Length } from "class-validator";
import { Wish } from "../../wishes/entities/wish.entity";
import { Offer } from "../../offers/entities/offer.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";
import { Exclude } from "class-transformer";

@Entity({ name: "users" })
@Unique(["username", "email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ length: 30 })
    @IsString()
    @Length(2, 30)
    username: string;

    @Column({ length: 200, default: "Пока ничего не рассказал о себе" })
    @IsString()
    @Length(2, 200)
    about: string;

    @Column({ default: "https://i.pravatar.cc/300" })
    @IsUrl()
    avatar: string;

    @Column({ select: false })
    @IsEmail()
    @Exclude()
    email: string;

    @Column({ select: false })
    @IsString()
    @Exclude()
    password: string;

    @OneToMany(() => Wish, (wish) => wish.owner)
    wishes: Wish[];

    @OneToMany(() => Offer, (offer) => offer.user)
    offers: Offer[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
    wishlists: Wishlist[];
}
