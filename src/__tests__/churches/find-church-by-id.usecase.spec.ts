import { NotFoundException } from '@nestjs/common';
import { FindChurchByIdUseCase } from 'src/modules/churches/application/find-church-by-id.usecase';
import { Church } from 'src/modules/churches/domain/church.entity';

const makeChurch = (overrides: Partial<Church> = {}): Church => ({
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
    ...overrides,
});

describe('FindChurchByIdUseCase', () => {
    const findById = jest.fn();
    const repo: any = { findById };
    const useCase = new FindChurchByIdUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should return the church when found', async () => {
        const church = makeChurch();
        findById.mockResolvedValue(church);

        const result = await useCase.execute('church-1');

        expect(result).toEqual(church);
        expect(findById).toHaveBeenCalledWith('church-1');
    });

    it('should throw NotFoundException when church does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
        expect(findById).toHaveBeenCalledWith('missing-id');
    });
});
