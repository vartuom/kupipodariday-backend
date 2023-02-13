import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcrypt";

@Injectable()
export class HashService {
    // Why is async mode recommended over sync mode?
    // We recommend using async API if you use bcrypt on a server.
    // Bcrypt hashing is CPU intensive which will cause
    // the sync APIs to block the event loop and prevent your
    // application from servicing any inbound requests or events.
    // The async version uses a thread pool which does not block the main event loop.
    async getHash(plainTextPassword: string) {
        return await hash(plainTextPassword, 10);
    }

    async compare(plainTextPassword, hash) {
        return await compare(plainTextPassword, hash);
    }
}
