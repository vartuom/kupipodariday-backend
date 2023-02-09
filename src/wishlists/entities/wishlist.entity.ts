import { Column, Entity, ManyToOne } from "typeorm";
import { IsUrl, Length } from "class-validator";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Wishlist {
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
}
