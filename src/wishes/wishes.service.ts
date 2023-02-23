import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wish } from "./entities/wish.entity";
import { In, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import {
    CANT_CHANGE_WISH_ERROR_MESSAGE,
    CANT_DELETE_WISH_ERROR_MESSAGE,
    CANT_DELETE_WISH_WITH_DONATIONS_ERROR_MESSAGE,
    CANT_UPDATE_WISH_PRICE_IF_DONATIONS_EXISTS_ERROR_MESSAGE,
    WISH_NOT_FOUND_ERROR_MESSAGE,
} from "../utils/errorConstants";

@Injectable()
export class WishesService {
    constructor(
        @InjectRepository(Wish)
        private readonly wishesRepository: Repository<Wish>,
        private readonly usersService: UsersService,
    ) {}
    async create(createWishDto: CreateWishDto, ownerId: number) {
        const owner = await this.usersService.findOneByIdOrFail(ownerId);
        const wish = await this.wishesRepository.create({
            ...createWishDto,
            owner: owner,
        });
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
        return lastWishes;
    }

    async findTop() {
        const topWishes = await this.wishesRepository.find({
            take: 20,
            order: { copied: "desc" },
            relations: ["owner", "offers"],
        });
        return topWishes;
    }

    async findOneOrFail(id: number) {
        const wish = await this.wishesRepository.findOne({
            where: { id },
            relations: ["owner", "offers"],
        });
        if (!wish) throw new NotFoundException(WISH_NOT_FOUND_ERROR_MESSAGE);
        return wish;
    }

    // пользователь опциональный, т.к. метод используется для обновления собранных средств в offersService
    async update(
        id: number,
        updateWishDto: UpdateWishDto,
        user?: Omit<User, "password">,
    ) {
        const wish = await this.findOneOrFail(id);
        if (user && wish.owner.id !== user.id) {
            throw new BadRequestException(CANT_CHANGE_WISH_ERROR_MESSAGE);
        }
        if (updateWishDto.price && wish.offers.length > 0)
            throw new BadRequestException(
                CANT_UPDATE_WISH_PRICE_IF_DONATIONS_EXISTS_ERROR_MESSAGE,
            );
        await this.wishesRepository.update(id, updateWishDto);
        return await this.findOneOrFail(id);
    }

    async remove(wishId: number, userId: number) {
        const wish = await this.findOneOrFail(wishId);
        if (userId !== wish.owner.id)
            throw new BadRequestException(CANT_DELETE_WISH_ERROR_MESSAGE);
        // я добавил каскадное удаление заявок, но было бы странно, если бы это можно было сделать.
        // в задании момент не описан, поэтому добавил еще вариант с обработкой ошибки
        // по аналогии с запретом на изменение стоимости при наличии донатов.
        if (wish.offers.length > 0)
            throw new BadRequestException(
                CANT_DELETE_WISH_WITH_DONATIONS_ERROR_MESSAGE,
            );
        await this.wishesRepository.delete(wishId);
        return wish;
    }

    async copy(wishId: number, ownerId: number) {
        const wish = await this.findOneOrFail(wishId);
        const user = await this.usersService.findOneByIdOrFail(ownerId);
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
        return await this.wishesRepository.save(copiedWish);
    }

    async findMany(idArray: number[]) {
        return await this.wishesRepository.find({
            where: { id: In(idArray) },
        });
    }
}
