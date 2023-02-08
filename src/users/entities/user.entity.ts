import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Unique,
} from "typeorm";
import { IsEmail, IsUrl, Length } from "class-validator";

@Entity()
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

    @Column()
    @IsEmail()
    email: boolean;

    @Column()
    password: boolean;
}
