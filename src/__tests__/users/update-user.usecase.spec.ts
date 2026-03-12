import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from 'src/modules/users/application/update-user.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
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

describe('UpdateUserUseCase', () => {
    const findById = jest.fn();
    const update = jest.fn();
    const repo: any = { findById, update };
    const useCase = new UpdateUserUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should update the user name as self', async () => {
        const dto: UpdateUserDto = { name: 'João Atualizado' };
        const updated = makeUser({ name: 'João Atualizado' });
        findById.mockResolvedValue(makeUser());
        update.mockResolvedValue(updated);

        const result = await useCase.execute('user-1', 'church-1', dto, 'user-1', ChurchRole.MEMBER);

        expect(result.name).toBe('João Atualizado');
        expect(update).toHaveBeenCalledWith('user-1', 'church-1', dto);
    });

    it('should throw NotFoundException when user does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(
            useCase.execute('missing', 'church-1', {}, 'issuer-1', ChurchRole.OWNER)
        ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when a MEMBER tries to change role via dto', async () => {
        const dto: UpdateUserDto = { role: ChurchRole.ADMIN };
        findById.mockResolvedValue(makeUser());

        await expect(
            useCase.execute('user-1', 'church-1', dto, 'user-1', ChurchRole.MEMBER)
        ).rejects.toThrow(ForbiddenException);

        expect(update).not.toHaveBeenCalled();
    });

    it('should allow an ADMIN to change user role', async () => {
        const dto: UpdateUserDto = { role: ChurchRole.LEADER };
        const updated = makeUser({ role: ChurchRole.LEADER });
        findById.mockResolvedValue(makeUser());
        update.mockResolvedValue(updated);

        const result = await useCase.execute('user-1', 'church-1', dto, 'admin-1', ChurchRole.ADMIN);

        expect(result.role).toBe(ChurchRole.LEADER);
    });
});
