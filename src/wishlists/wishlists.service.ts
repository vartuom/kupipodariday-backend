import { Injectable, NotFoundException } from "@nestjs/common";
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

    findOne(id: number) {
        return `This action returns a #${id} wishlist`;
    }

    update(id: number, updateWishlistDto: UpdateWishlistDto) {
        return `This action updates a #${id} wishlist`;
    }

    remove(id: number) {
        return `This action removes a #${id} wishlist`;
    }
}
