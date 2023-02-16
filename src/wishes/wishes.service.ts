import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wish } from "./entities/wish.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";

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

    findAll() {
        return `This action returns all wishes`;
    }

    findOne(id: number) {
        return `This action returns a #${id} wish`;
    }

    update(id: number, updateWishDto: UpdateWishDto) {
        return `This action updates a #${id} wish`;
    }

    remove(id: number) {
        return `This action removes a #${id} wish`;
    }
}
