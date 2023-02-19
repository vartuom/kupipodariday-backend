import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wish } from "./entities/wish.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class WishesService {
    constructor(
        @InjectRepository(Wish)
        private readonly wishesRepository: Repository<Wish>,
        private readonly usersService: UsersService,
    ) {}
    async create(createWishDto: CreateWishDto, ownerId: number) {
        const owner = await this.usersService.findOneById(ownerId);
        if (!owner) throw new NotFoundException("Пользователь не существует.");
        const wish = await this.wishesRepository.create({
            ...createWishDto,
            owner: owner,
        });
        delete wish.owner.password;
        return await this.wishesRepository.save(wish);
    }

    async findLast() {
        const lastWishes = await this.wishesRepository.find({
            // The difference is that take and skip will be not part of the query you will execute,
            // typeorm perform it after get results. This is util overall when your query
            // include any kind of join because result is not like TypeORM map to us.
            //
            // On the other hand, limit and offset are included in the query, but may not work as you expect
            // if you are using joins. For example, if you have an entity A with a relation OneToMany with B,
            // and you try get the first three entries on A (using limit 3) and you do the join with B,
            // if the first entry has 3 B, then you will get one A only.
            // https://stackoverflow.com/questions/68468192/difference-between-limit-and-take-in-typeorm
            take: 40,
            order: { createdAt: "desc" },
            relations: ["owner", "offers"],
        });
        // чистим выдачу от подтянутых паролей
        lastWishes.forEach((wish) => delete wish.owner.password);
        return lastWishes;
    }

    async findTop() {
        const topWishes = await this.wishesRepository.find({
            take: 20,
            order: { copied: "desc" },
            relations: ["owner", "offers"],
        });
        topWishes.forEach((wish) => delete wish.owner.password);
        return topWishes;
    }

    async findOne(id: number) {
        const wish = await this.wishesRepository.findOne({
            where: { id },
            relations: ["owner", "offers"],
        });
        if (!wish)
            throw new NotFoundException(
                "Желание с переданным id не существует.",
            );
        delete wish.owner.password;
        return wish;
    }

    async update(
        id: number,
        user: Omit<User, "password">,
        updateWishDto: UpdateWishDto,
    ) {
        const wish = await this.findOne(id);
        if (wish.owner.id !== user.id) {
            throw new BadRequestException(
                "Нельзя изменять желания других пользователей",
            );
        }
        await this.wishesRepository.update(id, updateWishDto);
        return await this.findOne(id);
    }

    remove(id: number) {
        return `This action removes a #${id} wish`;
    }

    async copy(wishId: number, ownerId: number) {
        const wish = await this.findOne(wishId);
        const user = await this.usersService.findOneById(ownerId);
        if (!wish || !user)
            throw new NotFoundException(
                "Пользователь или желание не существует.",
            );
        await this.wishesRepository.update(wish.id, { copied: wish.copied++ });
        const {
            id,
            createdAt,
            updatedAt,
            copied,
            raised,
            offers,
            ...restWishProps
        } = wish;
        const copiedWish = await this.wishesRepository.create({
            ...restWishProps,
            owner: user,
        });
        delete copiedWish.owner.password;
        return await this.wishesRepository.save(copiedWish);
    }
}
