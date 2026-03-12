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
    logoUrl: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

describe('FindChurchByIdUseCase', () => {
    const findById = jest.fn();
    const getUrl = jest.fn();
    const repo: any = { findById };
    const storageService: any = { getUrl };
    const useCase = new FindChurchByIdUseCase(repo, storageService);

    afterEach(() => jest.clearAllMocks());

    it('should return the church without logoSignedUrl when no logo exists', async () => {
        findById.mockResolvedValue(makeChurch());

        const result = await useCase.execute('church-1');

        expect(result.id).toBe('church-1');
        expect(result.logoSignedUrl).toBeNull();
        expect(getUrl).not.toHaveBeenCalled();
    });

    it('should return the church with logoSignedUrl when logo exists', async () => {
        const church = makeChurch({ logoUrl: 'logos/uuid-logo.png' });
        findById.mockResolvedValue(church);
        getUrl.mockResolvedValue({ signedUrl: 'https://r2.example.com/logos/uuid-logo.png?sig=abc' });

        const result = await useCase.execute('church-1');

        expect(result.logoSignedUrl).toBe('https://r2.example.com/logos/uuid-logo.png?sig=abc');
        expect(getUrl).toHaveBeenCalledWith('logos/uuid-logo.png');
    });

    it('should throw NotFoundException when church does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
        expect(getUrl).not.toHaveBeenCalled();
    });
});
