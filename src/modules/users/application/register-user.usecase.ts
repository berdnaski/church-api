import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { PasswordHasher } from 'src/core/security/password-hasher';
import { EmailAlreadyRegisteredException } from 'src/core/exceptions/email-already-registered.exception';
import { RegisterUserDto } from 'src/core/auth/dto/register-user.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ChurchRole } from '@prisma/client';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordHasher: PasswordHasher,
    ) { }

    async execute(dto: RegisterUserDto): Promise<UserResponseDto> {
        const church = await this.prisma.church.findUnique({
            where: { slug: dto.churchSlug },
        });

        if (!church) {
            throw new NotFoundException('Church not found');
        }

        const userWithEmail = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (userWithEmail) {
            throw new EmailAlreadyRegisteredException();
        }

        const hashedPassword = await this.passwordHasher.hash(dto.password);

        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                role: ChurchRole.MEMBER,
                churchId: church.id,
            },
        });

        return UserResponseDto.fromEntity(user as any);
    }
}
