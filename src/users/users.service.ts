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
import {
    EMAIL_EXISTS_ERROR_MESSAGE,
    USER_NOT_FOUND_ERROR_MESSAGE,
    USERNAME_EXISTS_ERROR_MESSAGE,
} from "../utils/errorConstants";

@Injectable()
// этот сервис дальше используем в модуле аунтификации, поэтому не забываем экспортировать его из модуля!
export class UsersService {
    constructor(
        // подключаем репозиторий, передаем в него сущность User
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly hashService: HashService,
    ) {}

    /*async findOneByEmailOrFail(email: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
        return user;
    }*/

    async findOneForAuthOrFail(username: string): Promise<User> {
        // возвращаем с паролем, т.к. метод используется в валидации
        const user = await this.usersRepository.findOne({
            select: ["id", "username", "email", "password"],
            where: { username: username },
        });
        if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
        return user;
    }

    async findOneByIdOrFail(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
        return user;
    }

    async findOneByNameOrFail(username: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ username });
        if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
        return user;
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
        const user = await this.findOneByIdOrFail(id);
        if (
            updateUserDto.username &&
            updateUserDto.username !== user.username
        ) {
            const isUsernameExists = await this.usersRepository.findOneBy({
                username: updateUserDto.username,
            });
            if (isUsernameExists)
                throw new BadRequestException(USERNAME_EXISTS_ERROR_MESSAGE);
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const isEmailExists = await this.usersRepository.findOneBy({
                email: updateUserDto.email,
            });
            if (isEmailExists)
                throw new BadRequestException(EMAIL_EXISTS_ERROR_MESSAGE);
        }
        if (updateUserDto.password)
            updateUserDto.password = await this.hashService.getHash(
                updateUserDto.password,
            );
        await this.usersRepository.update(user.id, updateUserDto);
        return await this.findOneByIdOrFail(user.id);
    }

    async create(createUserDto: CreateUserDto) {
        const isEmailExists = await this.usersRepository.findOneBy({
            email: createUserDto.email,
        });
        if (isEmailExists)
            throw new BadRequestException(EMAIL_EXISTS_ERROR_MESSAGE);
        const isUsernameExists = await this.usersRepository.findOneBy({
            username: createUserDto.username,
        });
        if (isUsernameExists)
            throw new BadRequestException(USERNAME_EXISTS_ERROR_MESSAGE);
        const user = this.usersRepository.create({
            ...createUserDto,
            // хэшируем с помощью bcrypt пароль перед добавлением в базу
            password: await this.hashService.getHash(createUserDto.password),
        });
        return await this.usersRepository.save(user);
    }
    async getUserWishes(username: string) {
        const user = await this.findOneByNameOrFail(username);
        const { wishes } = await this.usersRepository.findOne({
            where: { id: user.id },
            select: ["wishes"],
            relations: ["wishes", "wishes.owner", "wishes.offers"],
        });
        return wishes;
    }
}
