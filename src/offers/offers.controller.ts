import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard)
@Controller("offers")
export class OffersController {
    constructor(private readonly offersService: OffersService) {}

    @Post()
    create(
        @Body() createOfferDto: CreateOfferDto,
        @Req() { user }: { user: Omit<User, "password"> },
    ) {
        return this.offersService.create(createOfferDto, user.id);
    }

    @Get()
    findAll() {
        return this.offersService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.offersService.findOneOrFail(id);
    }
}
