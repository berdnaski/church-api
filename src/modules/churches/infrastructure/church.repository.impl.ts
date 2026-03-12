import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { ChurchRepository } from '../domain/church.repository';
import { Church } from '../domain/church.entity';

@Injectable()
export class ChurchRepositoryImpl implements ChurchRepository {
    constructor(private readonly prisma: PrismaService) { }

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
        }) as unknown as Promise<Church>;
    }

    async delete(id: string): Promise<Church> {
        return this.prisma.church.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false
            }
        }) as unknown as Promise<Church>;
    }

    async update(id: string, data: Partial<Church>): Promise<Church> {
        return this.prisma.church.update({
            where: { id },
            data,
        }) as unknown as Promise<Church>;
    }
}
