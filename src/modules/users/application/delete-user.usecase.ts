import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { ChurchRole } from '@prisma/client';

@Injectable()
export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: string, churchId: string, issuerId: string, issuerRole: ChurchRole): Promise<void> {
        const user = await this.userRepository.findById(id, churchId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.delete(id, churchId);
    }
}
