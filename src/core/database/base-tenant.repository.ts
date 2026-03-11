import { PaginationParamsDto } from '../../shared/pagination/pagination-params.dto';
import { PaginatedResultDto } from '../../shared/pagination/paginated-result.dto';

export abstract class BaseTenantRepository<T> {
    protected async findManyPaginated(
        model: any,
        churchId: string,
        params: PaginationParamsDto,
        extraWhere: any = {},
        include: any = {}
    ): Promise<PaginatedResultDto<T>> {
        const { skip, limit } = params;

        const where = {
            ...extraWhere,
            churchId,
            deletedAt: null,
        };

        const [items, total] = await Promise.all([
            model.findMany({
                where,
                skip,
                take: limit,
                include,
                orderBy: { createdAt: 'desc' },
            }),
            model.count({ where }),
        ]);

        return new PaginatedResultDto<T>(
            items,
            total,
            params.page ?? 1,
            params.limit ?? 10
        );
    }

    protected async findOneByTenant(
        model: any,
        id: string,
        churchId: string,
        include: any = {}
    ): Promise<T | null> {
        return model.findFirst({
            where: {
                id,
                churchId,
                deletedAt: null,
            },
            include,
        });
    }

    protected async updateByTenant(
        model: any,
        id: string,
        churchId: string,
        data: any
    ): Promise<T> {
        return model.update({
            where: { id, churchId },
            data,
        });
    }

    protected async softDeleteByTenant(
        model: any,
        id: string,
        churchId: string
    ): Promise<T> {
        return model.update({
            where: { id, churchId },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
}
