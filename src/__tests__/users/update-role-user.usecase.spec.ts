import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateRoleUserUseCase } from 'src/modules/users/application/update-role-user.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { ChurchRole } from '@prisma/client';
import { UpdateRoleDto } from 'src/modules/users/dto/update-role.dto';

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

describe('UpdateRoleUserUseCase', () => {
    const findById = jest.fn();
    const updateRole = jest.fn();
    const repo: any = { findById, updateRole };
    const useCase = new UpdateRoleUserUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should update the user role successfully', async () => {
        const dto: UpdateRoleDto = { role: ChurchRole.LEADER };
        const updated = makeUser({ role: ChurchRole.LEADER });
        findById.mockResolvedValue(makeUser());
        updateRole.mockResolvedValue(updated);

        const result = await useCase.execute('user-1', 'church-1', dto);

        expect(result.role).toBe(ChurchRole.LEADER);
        expect(updateRole).toHaveBeenCalledWith('user-1', 'church-1', ChurchRole.LEADER);
    });

    it('should throw NotFoundException when user does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(
            useCase.execute('missing', 'church-1', { role: ChurchRole.ADMIN })
        ).rejects.toThrow(NotFoundException);

        expect(updateRole).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when role is not provided in dto', async () => {
        findById.mockResolvedValue(makeUser());

        await expect(useCase.execute('user-1', 'church-1', {})).rejects.toThrow(BadRequestException);
        expect(updateRole).not.toHaveBeenCalled();
    });
});
