import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wish } from "../wishes/entities/wish.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { Wishlist } from "./entities/wishlist.entity";
import { WishesService } from "../wishes/wishes.service";

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistsRepository: Repository<Wishlist>,
        private readonly usersService: UsersService,
        private readonly wishesService: WishesService,
    ) {}
    async create(createWishlistDto: CreateWishlistDto, userId: number) {
        const user = await this.usersService.findOneById(userId);
        if (!user) throw new NotFoundException("Пользователь не существует.");
        const wishes = await this.wishesService.findMany(
            createWishlistDto.itemsId,
        );
        const wishlist = this.wishlistsRepository.create({
            ...createWishlistDto,
            owner: user,
            items: wishes,
        });
        await this.wishlistsRepository.save(wishlist);
        delete wishlist.owner.password;
        return wishlist;
    }

    async findAll() {
        const wishlists = await this.wishlistsRepository.find({
            relations: ["owner", "items"],
        });
        wishlists.forEach((wishlist) => delete wishlist.owner.password);
        return wishlists;
    }

    async findOne(id: number) {
        const wishlist = await this.wishlistsRepository.findOne({
            where: { id },
            relations: ["owner", "items"],
        });
        if (!wishlist) throw new NotFoundException("Список не существует.");
        delete wishlist.owner.password;
        delete wishlist.owner.email;
        return wishlist;
    }

    async update(listId: number, userId, updateWishlistDto: UpdateWishlistDto) {
        const wishlist = await this.findOne(listId);
        const user = await this.usersService.findOneById(userId);
        if (!user) throw new NotFoundException("Пользователь не найден.");
        if (wishlist.owner.id !== userId) {
            throw new BadRequestException(
                "Нельзя удалить списки других пользователей.",
            );
        }
        if (updateWishlistDto.itemsId) {
            const wishes = await this.wishesService.findMany(
                updateWishlistDto.itemsId,
            );
            const { itemsId, ...restUpdateProps } = updateWishlistDto;
            // ¯\_(ツ)_/¯ иначе  ERROR [ExceptionsHandler] Cannot query across many-to-many for property items
            Object.assign(wishlist, {
                ...restUpdateProps,
                items: wishes,
            });
            await this.wishlistsRepository.save(wishlist);
        } else {
            await this.wishlistsRepository.update(listId, updateWishlistDto);
        }
        return await this.findOne(listId);
    }

    async remove(listId: number, userId: number) {
        const wishlist = await this.findOne(listId);
        if (wishlist.owner.id !== userId)
            throw new ForbiddenException("Нельзя удалять чужие списки");
        await this.wishlistsRepository.delete(listId);
        return wishlist;
    }
}
