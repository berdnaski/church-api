import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { User } from '../domain/user.entity';

@Injectable()
export class UpdateUserProfileUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(userId: string, churchId: string, dto: UpdateUserProfileDto): Promise<User> {
        const user = await this.userRepository.findById(userId, churchId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const profileData = {
            ...dto,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            baptismDate: dto.baptismDate ? new Date(dto.baptismDate) : undefined,
            memberSince: dto.memberSince ? new Date(dto.memberSince) : undefined,
        };

        // Remove undefined values to avoid overwriting with null in Prisma if not intended
        // but here we want to allow partial updates. Prisma upsert handles this.
        return this.userRepository.updateProfile(userId, profileData);
    }
}
