import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";
import { Wish } from "./entities/wish.entity";

@Controller("wishes")
export class WishesController {
    constructor(private readonly wishesService: WishesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Req() { user }: { user: Omit<User, "password"> },
        @Body() createWishDto: CreateWishDto,
    ) {
        return this.wishesService.create(createWishDto, user.id);
    }

    @Get("last")
    async findLast(): Promise<Wish[]> {
        return await this.wishesService.findLast();
    }

    @Get("top")
    async findTop(): Promise<Wish[]> {
        return await this.wishesService.findTop();
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.wishesService.findOneOrFail(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    update(
        @Param("id") id: number,
        @Req() { user }: { user: Omit<User, "password"> },
        @Body() updateWishDto: UpdateWishDto,
    ) {
        return this.wishesService.update(id, updateWishDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    remove(
        @Param("id") wishId: number,
        @Req() { user }: { user: Omit<User, "password"> },
    ) {
        return this.wishesService.remove(wishId, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(":id/copy")
    copy(
        @Req() { user }: { user: Omit<User, "password"> },
        @Param("id") id: number,
    ) {
        return this.wishesService.copy(id, user.id);
    }
}
