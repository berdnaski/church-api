import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { ChurchRepository } from '../domain/church.repository';
import { Church } from '../domain/church.entity';
import { BaseTenantRepository } from 'src/core/database/base-tenant.repository';

@Injectable()
export class ChurchRepositoryImpl extends BaseTenantRepository<Church> implements ChurchRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async findById(id: string): Promise<Church | null> {
        return this.prisma.church.findUnique({
            where: { id, deletedAt: null }
        }) as Promise<Church | null>;
    }

    async findBySlug(slug: string): Promise<Church | null> {
        return this.prisma.church.findUnique({
            where: { slug }
        }) as Promise<Church | null>;
    }

    async create(data: { name: string; slug: string }): Promise<Church> {
        return this.prisma.church.create({
            data
        }) as Promise<Church>;
    }
}
