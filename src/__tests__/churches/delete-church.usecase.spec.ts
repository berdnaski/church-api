import { NotFoundException } from '@nestjs/common';
import { DeleteChurchUseCase } from 'src/modules/churches/application/delete-church.usecase';
import { Church } from 'src/modules/churches/domain/church.entity';

const makeChurch = (): Church => ({
    id: 'church-1',
    name: 'Igreja Teste',
    slug: 'igreja-teste',
    isActive: true,
    address: null,
    phone: null,
    email: null,
    description: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
});

describe('DeleteChurchUseCase', () => {
    const findById = jest.fn();
    const deleteFn = jest.fn();
    const repo: any = { findById, delete: deleteFn };
    const useCase = new DeleteChurchUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should soft-delete the church when found', async () => {
        findById.mockResolvedValue(makeChurch());
        deleteFn.mockResolvedValue(makeChurch());

        await useCase.execute('church-1');

        expect(findById).toHaveBeenCalledWith('church-1');
        expect(deleteFn).toHaveBeenCalledWith('church-1');
    });

    it('should throw NotFoundException when church does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
        expect(deleteFn).not.toHaveBeenCalled();
    });
});
