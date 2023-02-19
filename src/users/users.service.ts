import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Like, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashService } from "../hash/hash.service";
import { FindUsersDto } from "./dto/find-users.dto";
import { Wish } from "../wishes/entities/wish.entity";

@Injectable()
// этот сервис дальше используем в модуле аунтификации, поэтому не забываем экспортировать его из модуля!
export class UsersService {
    constructor(
        // подключаем репозиторий, передаем в него сущность User
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly hashService: HashService,
    ) {}

    findOneByEmail(email: string): Promise<User> {
        // возвращаем с паролем, т.к. метод используется в валидации
        return this.usersRepository.findOneBy({ email });
    }

    findOneById(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }

    findOneByName(username: string): Promise<User> {
        return this.usersRepository.findOneBy({ username });
    }

    findMany({ query }: FindUsersDto): Promise<User[]> {
        return this.usersRepository.find({
            // перечисление внутри массива = OR
            // Like - частичное совпадение, % - n символов с обоих концов
            // не чувствительно к регистру
            where: [
                { username: Like(`%${query}%`) },
                { email: Like(`%${query}%`) },
            ],
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.findOneById(id);
        if (
            updateUserDto.username &&
            updateUserDto.username !== user.username
        ) {
            const userByName = await this.findOneByName(updateUserDto.username);
            if (userByName)
                throw new BadRequestException(
                    "Пользователь с таким email или username уже зарегистрирован.",
                );
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const userByEmail = await this.findOneByEmail(updateUserDto.email);
            if (userByEmail)
                throw new BadRequestException(
                    "Пользователь с таким email или username уже зарегистрирован.",
                );
        }
        if (updateUserDto.password)
            updateUserDto.password = await this.hashService.getHash(
                updateUserDto.password,
            );
        await this.usersRepository.update(user.id, updateUserDto);
        return await this.findOneById(user.id);
    }

    async create(createUserDto: CreateUserDto) {
        const isEmailExists = await this.findOneByEmail(createUserDto.email);
        const isUsernameExists = await this.findOneByEmail(
            createUserDto.username,
        );
        if (isEmailExists || isUsernameExists)
            throw new BadRequestException(
                "Пользователь с таким email или username уже зарегистрирован.",
            );
        const user = this.usersRepository.create({
            ...createUserDto,
            // хэшируем с помощью bcrypt пароль перед добавлением в базу
            password: await this.hashService.getHash(createUserDto.password),
        });
        return await this.usersRepository.save(user);
    }

    async getUserWishes(userId: number) {
        const { wishes } = await this.usersRepository.findOne({
            where: { id: userId },
            select: ["wishes"],
            relations: ["wishes", "wishes.owner", "wishes.offers"],
        });
        wishes.forEach((wish) => delete wish.owner.password);
        return wishes;
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
