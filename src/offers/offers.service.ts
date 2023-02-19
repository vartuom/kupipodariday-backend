import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { Offer } from "./entities/offer.entity";
import { WishesService } from "../wishes/wishes.service";
import { UpdateWishDto } from "../wishes/dto/update-wish.dto";

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer)
        private readonly offersRepository: Repository<Offer>,
        private readonly usersService: UsersService,
        private readonly wishesService: WishesService,
    ) {}
    async create(createOfferDto: CreateOfferDto, userId: number) {
        const user = await this.usersService.findOneById(userId);
        if (!user) throw new NotFoundException("Пользователь не существует.");
        const wish = await this.wishesService.findOne(createOfferDto.itemId);
        const raised = wish.raised + createOfferDto.amount;
        if (raised >= wish.price) {
            throw new BadRequestException(
                "Сумма собранных средств не может превышать стоимость подарка.",
            );
        }
        await this.wishesService.update(createOfferDto.itemId, {
            raised: raised,
        } as UpdateWishDto);
        const offer = this.offersRepository.create({
            ...createOfferDto,
            user,
            item: wish,
        });
        return await this.offersRepository.save(offer);
    }

    async findAll() {
        const offers = await this.offersRepository.find({
            relations: ["user", "item"],
        });
        offers.forEach((offer) => delete offer.user.password);
        return offers;
    }

    async findOne(id: number) {
        const offer = await this.offersRepository.findOne({
            where: { id },
            relations: ["user", "item"],
        });
        if (!offer) throw new NotFoundException("Предложение не существует");
        delete offer.user.password;
        return offer;
    }

    update(id: number, updateOfferDto: UpdateOfferDto) {
        return `This action updates a #${id} offer`;
    }

    remove(id: number) {
        return `This action removes a #${id} offer`;
    }
}
