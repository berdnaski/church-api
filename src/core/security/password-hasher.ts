import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasher {
    private readonly SALT_ROUNDS = 10;

    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.SALT_ROUNDS);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}
