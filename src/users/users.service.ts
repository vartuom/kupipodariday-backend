import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export interface UserTemp {
    id: number;
    name: string;
    email: string;
    password: string;
}

@Injectable()
// этот сервис дальше используем в модуле аунтификации, поэтому не забываем экспортировать его из модуля!
export class UsersService {
    private readonly usersMockDD: UserTemp[] = [
        {
            id: 1,
            name: "pickle rick",
            email: "gayfish@ya.ru",
            password: "42",
        },
        {
            id: 2,
            name: "morty",
            email: "lol@ya.ru",
            password: "43",
        },
    ];

    findByEmail(email: string): UserTemp | undefined {
        return this.usersMockDD.find((user) => user.email === email);
    }

    create(createUserDto: CreateUserDto) {
        return "This action adds a new user";
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
