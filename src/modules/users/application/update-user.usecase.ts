import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../domain/user.entity';
import { ChurchRole } from '@prisma/client';

@Injectable()
export class UpdateUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(
        id: string,
        churchId: string,
        dto: UpdateUserDto,
        issuerId: string,
        issuerRole: ChurchRole
    ): Promise<User> {
        const user = await this.userRepository.findById(id, churchId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isAdmin = ([ChurchRole.OWNER, ChurchRole.PASTOR, ChurchRole.ADMIN] as ChurchRole[]).includes(issuerRole);

        if (dto.role && !isAdmin) {
            throw new ForbiddenException('Only admins, pastors or owners can change user roles');
        }

        return this.userRepository.update(id, churchId, dto);
    }
}
