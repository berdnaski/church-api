import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { ChurchRole } from '@prisma/client';
import { BaseTenantRepository } from 'src/core/database/base-tenant.repository';
import { PaginationParamsDto } from 'src/shared/pagination/pagination-params.dto';
import { PaginatedResultDto } from 'src/shared/pagination/paginated-result.dto';

@Injectable()
export class UserRepositoryImpl extends BaseTenantRepository<User> implements UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
    }

    async findById(id: string, churchId: string): Promise<User | null> {
        return this.findOneByTenant(this.prisma.user, id, churchId) as Promise<User | null>;
    }

    async list(churchId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<User>> {
        return this.findManyPaginated(this.prisma.user, churchId, params) as Promise<PaginatedResultDto<User>>;
    }

    async update(id: string, churchId: string, data: Partial<User>): Promise<User> {
        return this.updateByTenant(this.prisma.user, id, churchId, data) as Promise<User>;
    }

    async delete(id: string, churchId: string): Promise<User> {
        return this.softDeleteByTenant(this.prisma.user, id, churchId) as Promise<User>;
    }

    async create(data: {
        name: string;
        email: string;
        password: string;
        role?: ChurchRole;
        churchId: string;
    }): Promise<User> {
        return this.prisma.user.create({
            data: {
                ...data,
            },
        }) as Promise<User>;
    }

    async updateRole(id: string, churchId: string, role: ChurchRole): Promise<User> {
        return this.updateByTenant(this.prisma.user, id, churchId, { role }) as Promise<User>;
    }

    async createResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
        await this.prisma.passwordReset.upsert({
            where: { userId },
            update: { token, expiresAt, createdAt: new Date() },
            create: { userId, token, expiresAt },
        });
    }

    async findByResetToken(token: string): Promise<{ user: User } | null> {
        const reset = await this.prisma.passwordReset.findFirst({
            where: {
                token,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });

        if (!reset) return null;

        return { user: reset.user as unknown as User };
    }

    async updatePassword(id: string, passwordHash: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { password: passwordHash },
        });
    }

    async invalidateToken(token: string): Promise<void> {
        await this.prisma.passwordReset.deleteMany({
            where: { token },
        });
    }
}
