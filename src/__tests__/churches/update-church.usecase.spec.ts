import { NotFoundException } from '@nestjs/common';
import { UpdateChurchUseCase } from 'src/modules/churches/application/update-church.usecase';
import { Church } from 'src/modules/churches/domain/church.entity';
import { UpdateChurchDto } from 'src/modules/churches/dto/update-church.dto';

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

describe('UpdateChurchUseCase', () => {
    const findById = jest.fn();
    const update = jest.fn();
    const repo: any = { findById, update };
    const useCase = new UpdateChurchUseCase(repo);

    afterEach(() => jest.clearAllMocks());

    it('should update and return the church when found', async () => {
        const dto: UpdateChurchDto = { name: 'Igreja Atualizada' };
        const updated = makeChurch({ name: 'Igreja Atualizada' });
        findById.mockResolvedValue(makeChurch());
        update.mockResolvedValue(updated);

        const result = await useCase.execute('church-1', dto);

        expect(result).toEqual(updated);
        expect(findById).toHaveBeenCalledWith('church-1');
        expect(update).toHaveBeenCalledWith('church-1', dto);
    });

    it('should throw NotFoundException when church does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing-id', {})).rejects.toThrow(NotFoundException);
        expect(update).not.toHaveBeenCalled();
    });
});
