import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Offer {
    @Column("numeric", { scale: 2 })
    amount: number;

    @Column({ default: false })
    hidden: boolean;

    @ManyToOne(() => User, (user) => user.offers)
    user: User;
}
