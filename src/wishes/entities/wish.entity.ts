import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsUrl, Length } from "class-validator";
import { User } from "../../users/entities/user.entity";
import { Offer } from "../../offers/entities/offer.entity";

@Entity({ name: "wishes" })
export class Wish {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ length: 250 })
    @Length(1, 250)
    name: string;

    @Column()
    @IsUrl()
    link: string;

    @Column()
    @IsUrl()
    image: string;

    @Column("numeric", { scale: 2 })
    price: number;

    @Column("numeric", { scale: 2, default: 0 })
    raised: number;

    @Column({ length: 1024 })
    @Length(1, 1024)
    description: string;

    @Column("numeric", { default: 0 })
    copied: number;

    @ManyToOne(() => User, (user) => user.wishes)
    owner: User;

    @OneToMany(() => Offer, (offer) => offer.item)
    offers: Offer[];
}
