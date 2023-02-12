import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashService } from "../hash/hash.service";

export interface UserTemp {
    id: number;
    name: string;
    email: string;
    password: string;
}

@Injectable()
// этот сервис дальше используем в модуле аунтификации, поэтому не забываем экспортировать его из модуля!
export class UsersService {
    constructor(
        // подключаем репозиторий, передаем в него сущность User
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly hashService: HashService,
    ) {}

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

    findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOneBy({ email });
    }

    findOneByName(username: string) {
        return this.usersRepository.findOneBy({ username });
    }

    async create(createUserDto: CreateUserDto) {
        const isEmailExists = await this.findOneByEmail(createUserDto.email);
        const isUsernameExists = await this.findOneByEmail(
            createUserDto.username,
        );
        if (isEmailExists || isUsernameExists)
            throw new BadRequestException(
                "Пользователь с таким именем или почтой уже существует.",
            );
        const user = this.usersRepository.create({
            ...createUserDto,
            // хэшируем с помощью bcrypt пароль перед добавлением в базу
            password: await this.hashService.getHash(createUserDto.password),
        });
        // исключаем пароль из ответа
        const { password, ...restUserProps } = await this.usersRepository.save(
            user,
        );
        return restUserProps;
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
