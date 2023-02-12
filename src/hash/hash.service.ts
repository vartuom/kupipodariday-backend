import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";

@Injectable()
export class HashService {
    async getHash(myPlaintextPassword: string) {
        return await hash(myPlaintextPassword, 10);
    }
}
