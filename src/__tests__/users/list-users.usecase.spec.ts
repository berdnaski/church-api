import { ListUsersUseCase } from 'src/modules/users/application/list-users.usecase';
import { PaginatedResultDto } from 'src/shared/pagination/paginated-result.dto';
import { PaginationParamsDto } from 'src/shared/pagination/pagination-params.dto';
import { ChurchRole } from '@prisma/client';

describe('ListUsersUseCase', () => {
    const list = jest.fn();
    const repo: any = { list };
    const useCase = new ListUsersUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    const defaultParams: PaginationParamsDto = { page: 1, limit: 10, skip: 0 };

    it('should return a paginated list of users', async () => {
        const paginatedResult = new PaginatedResultDto(
            [{
                id: 'user-1', name: 'João', email: 'joao@test.com',
                password: 'hash', role: ChurchRole.MEMBER, isActive: true,
                deletedAt: null, churchId: 'church-1', createdAt: new Date(), updatedAt: new Date(),
            }],
            1, 1, 10
        );

        list.mockResolvedValue(paginatedResult);

        const result = await useCase.execute('church-1', defaultParams);

        expect(result.data).toHaveLength(1);
        expect(result.total).toBe(1);
        expect(list).toHaveBeenCalledWith('church-1', defaultParams);
    });

    it('should return empty result when no users exist', async () => {
        const emptyResult = new PaginatedResultDto([], 0, 1, 10);
        list.mockResolvedValue(emptyResult);

        const result = await useCase.execute('church-1', defaultParams);

        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
    });
});
