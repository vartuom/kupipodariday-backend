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
import { use } from "passport";

@UseGuards(JwtAuthGuard)
@Controller("wishlists")
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
    findOne(@Param("id") id: string) {
        return this.wishlistsService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateWishlistDto: UpdateWishlistDto,
    ) {
        return this.wishlistsService.update(+id, updateWishlistDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.wishlistsService.remove(+id);
    }
}
