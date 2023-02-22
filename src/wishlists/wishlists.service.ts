import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { Wishlist } from "./entities/wishlist.entity";
import { WishesService } from "../wishes/wishes.service";
import {
    CANT_CHANGE_WISHLIST_ERROR_MESSAGE,
    CANT_DELETE_WISHLIST_ERROR_MESSAGE,
    WISHLIST_NOT_FOUND_ERROR_MESSAGE,
} from "../utils/errorConstants";

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistsRepository: Repository<Wishlist>,
        private readonly usersService: UsersService,
        private readonly wishesService: WishesService,
    ) {}
    async create(createWishlistDto: CreateWishlistDto, userId: number) {
        const user = await this.usersService.findOneByIdOrFail(userId);
        const wishes = await this.wishesService.findMany(
            createWishlistDto.itemsId,
        );
        const wishlist = this.wishlistsRepository.create({
            ...createWishlistDto,
            owner: user,
            items: wishes,
        });
        await this.wishlistsRepository.save(wishlist);
        return wishlist;
    }

    async findAll() {
        const wishlists = await this.wishlistsRepository.find({
            relations: ["owner", "items"],
        });
        return wishlists;
    }

    async findOneOrFail(id: number) {
        const wishlist = await this.wishlistsRepository.findOne({
            where: { id },
            relations: ["owner", "items"],
        });
        if (!wishlist)
            throw new NotFoundException(WISHLIST_NOT_FOUND_ERROR_MESSAGE);
        return wishlist;
    }

    async update(listId: number, userId, updateWishlistDto: UpdateWishlistDto) {
        const wishlist = await this.findOneOrFail(listId);
        if (wishlist.owner.id !== userId) {
            throw new BadRequestException(CANT_CHANGE_WISHLIST_ERROR_MESSAGE);
        }
        if (updateWishlistDto.itemsId) {
            const wishes = await this.wishesService.findMany(
                updateWishlistDto.itemsId,
            );
            const { itemsId, ...restUpdateProps } = updateWishlistDto;
            // ¯\_(ツ)_/¯ способ обойти ERROR [ExceptionsHandler] Cannot query across many-to-many for property items
            Object.assign(wishlist, {
                ...restUpdateProps,
                items: wishes,
            });
            await this.wishlistsRepository.save(wishlist);
        } else {
            await this.wishlistsRepository.update(listId, updateWishlistDto);
        }
        return await this.findOneOrFail(listId);
    }

    async remove(listId: number, userId: number) {
        const wishlist = await this.findOneOrFail(listId);
        if (wishlist.owner.id !== userId)
            throw new ForbiddenException(CANT_DELETE_WISHLIST_ERROR_MESSAGE);
        await this.wishlistsRepository.delete(listId);
        return wishlist;
    }
}
