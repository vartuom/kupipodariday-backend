import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Unique,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { IsEmail, IsUrl, Length } from "class-validator";
import { Wish } from "../../wishes/entities/wish.entity";
import { Offer } from "../../offers/entities/offer.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";

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
    @Length(2, 30)
    username: string;

    @Column({ length: 200, default: "Пока ничего не рассказал о себе" })
    @Length(2, 200)
    about: string;

    @Column({ default: "https://i.pravatar.cc/300" })
    @IsUrl()
    avatar: string;

    @Column({ select: false })
    @IsEmail()
    email: boolean;

    @Column({ select: false })
    password: boolean;

    @OneToMany(() => Wish, (wish) => wish.owner)
    wishes: Wish[];

    @OneToMany(() => Offer, (offer) => offer.user)
    offers: Offer[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
    wishlists: Wishlist[];
}
