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
import { WishlistsService } from "./wishlists.service";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard)
@Controller("wishlistlists")
export class WishlistsController {
    constructor(private readonly wishlistsService: WishlistsService) {}

    @Post()
    create(
        @Body() createWishlistDto: CreateWishlistDto,
        @Req() { user }: { user: Omit<User, "password"> },
    ) {
        return this.wishlistsService.create(createWishlistDto, user.id);
    }

    @Get()
    findAll() {
        return this.wishlistsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.wishlistsService.findOneOrFail(id);
    }

    @Patch(":id")
    update(
        @Param("id") listId: number,
        @Req() { user }: { user: Omit<User, "password"> },
        @Body() updateWishlistDto: UpdateWishlistDto,
    ) {
        return this.wishlistsService.update(listId, user.id, updateWishlistDto);
    }

    @Delete(":id")
    remove(
        @Param("id") listId: number,
        @Req() { user }: { user: Omit<User, "password"> },
    ) {
        return this.wishlistsService.remove(listId, user.id);
    }
}
