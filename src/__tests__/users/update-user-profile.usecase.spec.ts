import { NotFoundException } from '@nestjs/common';
import { UpdateUserProfileUseCase } from 'src/modules/users/application/update-user-profile.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { ChurchRole, BaptismStatus } from '@prisma/client';

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

describe('UpdateUserProfileUseCase', () => {
    const findById = jest.fn();
    const updateProfile = jest.fn();

    const repo: any = { findById, updateProfile };
    const useCase = new UpdateUserProfileUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should update profile when user exists', async () => {
        const user = makeUser();
        const dto = {
            phone: '11999999999',
            baptismStatus: BaptismStatus.BAPTIZED,
            birthDate: '1990-01-01',
        };

        findById.mockResolvedValue(user);
        updateProfile.mockResolvedValue({ ...user, profile: dto });

        const result = await useCase.execute('user-1', 'church-1', dto);

        expect(findById).toHaveBeenCalledWith('user-1', 'church-1');
        expect(updateProfile).toHaveBeenCalledWith('user-1', {
            ...dto,
            birthDate: new Date('1990-01-01'),
            baptismDate: undefined,
            memberSince: undefined,
        });
        expect(result.id).toBe('user-1');
    });

    it('should throw NotFoundException when user does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing', 'church-1', {})).rejects.toThrow(NotFoundException);
    });
});
