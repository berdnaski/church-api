import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from 'src/modules/users/application/delete-user.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { ChurchRole } from '@prisma/client';

const makeUser = (): User => ({
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
});

describe('DeleteUserUseCase', () => {
    const findById = jest.fn();
    const deleteFn = jest.fn();
    const repo: any = { findById, delete: deleteFn };
    const useCase = new DeleteUserUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should soft-delete the user when found', async () => {
        findById.mockResolvedValue(makeUser());
        deleteFn.mockResolvedValue(undefined);

        await useCase.execute('user-1', 'church-1', 'issuer-1', ChurchRole.ADMIN);

        expect(findById).toHaveBeenCalledWith('user-1', 'church-1');
        expect(deleteFn).toHaveBeenCalledWith('user-1', 'church-1');
    });

    it('should throw NotFoundException when user does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(
            useCase.execute('missing', 'church-1', 'issuer-1', ChurchRole.ADMIN)
        ).rejects.toThrow(NotFoundException);

        expect(deleteFn).not.toHaveBeenCalled();
    });
});
