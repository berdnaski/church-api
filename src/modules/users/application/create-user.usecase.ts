import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { PasswordHasher } from 'src/core/security/password-hasher';
import { User } from '../domain/user.entity';
import { ChurchRole } from '@prisma/client';

@Injectable()
export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) { }

    async execute(data: {
        name: string;
        email: string;
        password: string;
        role?: ChurchRole;
        churchId: string;
    }): Promise<User> {
        const hashedPassword = await this.passwordHasher.hash(data.password);
        return this.userRepository.create({ ...data, password: hashedPassword });
    }
}
