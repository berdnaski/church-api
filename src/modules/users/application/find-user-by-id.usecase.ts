import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class FindUserByIdUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: string, churchId: string): Promise<User> {
        const user = await this.userRepository.findById(id, churchId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
