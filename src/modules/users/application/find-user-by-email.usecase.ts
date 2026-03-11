import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }
}
