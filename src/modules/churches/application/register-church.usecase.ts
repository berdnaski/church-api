import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { PasswordHasher } from 'src/core/security/password-hasher';
import { EmailAlreadyRegisteredException } from 'src/core/exceptions/email-already-registered.exception';
import { SlugAlreadyInUseException } from 'src/core/exceptions/slug-already-in-use.exception';
import { RegisterChurchDto } from 'src/core/auth/dto/register-church.dto';
import { RegisterChurchResponseDto } from '../dto/register-church-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ChurchRole } from '@prisma/client';

@Injectable()
export class RegisterChurchUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordHasher: PasswordHasher,
    ) { }

    async execute(dto: RegisterChurchDto): Promise<RegisterChurchResponseDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.ownerEmail },
        });
        if (existingUser) {
            throw new EmailAlreadyRegisteredException();
        }

        const existingChurch = await this.prisma.church.findUnique({
            where: { slug: dto.churchSlug },
        });
        if (existingChurch) {
            throw new SlugAlreadyInUseException();
        }

        const hashedPassword = await this.passwordHasher.hash(dto.ownerPassword);

        return this.prisma.$transaction(async (tx) => {
            const church = await tx.church.create({
                data: {
                    name: dto.churchName,
                    slug: dto.churchSlug,
                },
            });

            const user = await tx.user.create({
                data: {
                    name: dto.ownerName,
                    email: dto.ownerEmail,
                    password: hashedPassword,
                    role: ChurchRole.OWNER,
                    churchId: church.id,
                },
            });

            return {
                church,
                user: UserResponseDto.fromEntity(user as any),
            };
        });
    }
}
