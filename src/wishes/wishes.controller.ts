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

@UseGuards(JwtAuthGuard)
@Controller("wishes")
export class WishesController {
    constructor(private readonly wishesService: WishesService) {}

    @Post()
    create(
        @Req() { user }: { user: Omit<User, "password"> },
        @Body() createWishDto: CreateWishDto,
    ) {
        return this.wishesService.create(createWishDto, user.id);
    }

    @Get()
    findAll() {
        return this.wishesService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.wishesService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateWishDto: UpdateWishDto) {
        return this.wishesService.update(+id, updateWishDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.wishesService.remove(+id);
    }
}
