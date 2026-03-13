import { Injectable } from "@nestjs/common";
import { BaseTenantRepository } from "src/core/database/base-tenant.repository";
import { Department } from "../domain/department.entity";
import { DepartmentRepository, CreateDepartmentInput } from "../domain/department.repository";
import { PrismaService } from "src/core/database/prisma.service";
import { DepartmentRole } from "@prisma/client";
import { PaginationParamsDto } from "src/shared/pagination/pagination-params.dto";
import { PaginatedResultDto } from "src/shared/pagination/paginated-result.dto";

@Injectable()
export class DepartmentRepositoryImpl extends BaseTenantRepository<Department> implements DepartmentRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async create(data: CreateDepartmentInput): Promise<Department> {
        return this.prisma.department.create({
            data: {
                name: data.name,
                churchId: data.churchId,
                departmentMembers: {
                    create: {
                        userId: data.userId,
                        role: DepartmentRole.LEADER
                    }
                }
            }
        }) as unknown as Promise<Department>;
    }

    async findByName(name: string, churchId: string): Promise<Department | null> {
        return this.prisma.department.findFirst({
            where: { name, churchId, deletedAt: null }
        });
    }

    async list(churchId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<Department>> {
        return this.findManyPaginated(this.prisma.department, churchId, params) as Promise<PaginatedResultDto<Department>>;
    }
}