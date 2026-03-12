import { NotFoundException } from '@nestjs/common';
import { FindUserByIdUseCase } from 'src/modules/users/application/find-user-by-id.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { ChurchRole } from '@prisma/client';

const makeUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@teste.com',
    password: 'hashed',
    role: ChurchRole.MEMBER,
    isActive: true,
    deletedAt: null,
    churchId: 'church-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

describe('FindUserByIdUseCase', () => {
    const findById = jest.fn();
    const repo: any = { findById };
    const useCase = new FindUserByIdUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should return the user when found', async () => {
        const user = makeUser();
        findById.mockResolvedValue(user);

        const result = await useCase.execute('user-1', 'church-1');

        expect(result).toEqual(user);
        expect(findById).toHaveBeenCalledWith('user-1', 'church-1');
    });

    it('should throw NotFoundException when user does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing', 'church-1')).rejects.toThrow(NotFoundException);
    });
});
