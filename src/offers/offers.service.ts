import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { Offer } from "./entities/offer.entity";
import { WishesService } from "../wishes/wishes.service";
import { UpdateWishDto } from "../wishes/dto/update-wish.dto";
import {
    CANT_DONATE_FOR_YOURSELF_ERROR_MESSAGE,
    OFFER_AMOUNT_EXCEEDS_ITEM_PRICE_ERROR_MESSAGE,
    OFFER_NOT_FOUND_ERROR_MESSAGE,
} from "../utils/errorConstants";

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer)
        private readonly offersRepository: Repository<Offer>,
        private readonly usersService: UsersService,
        private readonly wishesService: WishesService,
    ) {}
    async create(createOfferDto: CreateOfferDto, userId: number) {
        const user = await this.usersService.findOneByIdOrFail(userId);
        const wish = await this.wishesService.findOneOrFail(
            createOfferDto.itemId,
        );
        if (user.id === wish.owner.id) {
            throw new BadRequestException(
                CANT_DONATE_FOR_YOURSELF_ERROR_MESSAGE,
            );
        }
        // постгрес возвращает цифры с точкой как стринги, вау
        const raised = +wish.raised + createOfferDto.amount;
        if (raised > wish.price) {
            throw new BadRequestException(
                OFFER_AMOUNT_EXCEEDS_ITEM_PRICE_ERROR_MESSAGE,
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

    async findOneOrFail(id: number) {
        const offer = await this.offersRepository.findOne({
            where: { id },
            relations: ["user", "item"],
        });
        if (!offer) throw new NotFoundException(OFFER_NOT_FOUND_ERROR_MESSAGE);
        delete offer.user.password;
        return offer;
    }
}
