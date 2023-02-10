import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinTable,
} from "typeorm";
import { IsUrl, Length } from "class-validator";
import { User } from "../../users/entities/user.entity";
import { Wish } from "../../wishes/entities/wish.entity";

@Entity({ name: "wishlists" })
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ length: 250 })
    @Length(1, 250)
    name: string;

    @Column({ length: 1500 })
    @Length(0, 1500)
    description: string;

    @Column()
    @IsUrl()
    image: string;

    @ManyToOne(() => User, (user) => user.wishlists)
    owner: User;

    @ManyToMany(() => Wish)
    @JoinTable()
    items: Wish[];
}
