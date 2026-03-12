import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UploadChurchLogoUseCase } from 'src/modules/churches/application/upload-church-logo.usecase';
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

const makeFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
    fieldname: 'file',
    originalname: 'logo.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024,
    buffer: Buffer.from('fake-image-data'),
    stream: null as any,
    destination: '',
    filename: 'logo.png',
    path: '',
    ...overrides,
});

describe('UploadChurchLogoUseCase', () => {
    const findById = jest.fn();
    const updateLogo = jest.fn();
    const deleteFn = jest.fn();
    const upload = jest.fn();

    const repo: any = { findById, updateLogo };
    const storageService: any = { upload, delete: deleteFn };

    const useCase = new UploadChurchLogoUseCase(repo, storageService);

    afterEach(() => jest.clearAllMocks());

    it('should upload logo and update church successfully', async () => {
        const file = makeFile();
        const updated = makeChurch({ logoUrl: 'logos/uuid-logo.png' });

        findById.mockResolvedValue(makeChurch());
        upload.mockResolvedValue({ path: 'logos/uuid-logo.png', filename: 'logo.png', mimetype: 'image/png' });
        updateLogo.mockResolvedValue(updated);

        const result = await useCase.execute('church-1', file);

        expect(result.logoUrl).toBe('logos/uuid-logo.png');
        expect(upload).toHaveBeenCalledWith(expect.objectContaining({
            mimetype: 'image/png',
            folder: 'logos',
        }));
        expect(updateLogo).toHaveBeenCalledWith('church-1', 'logos/uuid-logo.png');
        expect(deleteFn).not.toHaveBeenCalled(); // no previous logo
    });

    it('should delete old logo before uploading new one', async () => {
        const file = makeFile();
        const churchWithLogo = makeChurch({ logoUrl: 'logos/old-logo.png' });
        const updated = makeChurch({ logoUrl: 'logos/new-logo.png' });

        findById.mockResolvedValue(churchWithLogo);
        upload.mockResolvedValue({ path: 'logos/new-logo.png', filename: 'logo.png', mimetype: 'image/png' });
        updateLogo.mockResolvedValue(updated);

        await useCase.execute('church-1', file);

        expect(deleteFn).toHaveBeenCalledWith('logos/old-logo.png');
        expect(upload).toHaveBeenCalled();
    });

    it('should throw NotFoundException when church does not exist', async () => {
        findById.mockResolvedValue(null);

        await expect(useCase.execute('missing', makeFile())).rejects.toThrow(NotFoundException);
        expect(upload).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when no file is provided', async () => {
        findById.mockResolvedValue(makeChurch());

        await expect(useCase.execute('church-1', null as any)).rejects.toThrow(BadRequestException);
        expect(upload).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for an invalid file type', async () => {
        findById.mockResolvedValue(makeChurch());
        const invalidFile = makeFile({ mimetype: 'application/pdf', originalname: 'doc.pdf' });

        await expect(useCase.execute('church-1', invalidFile)).rejects.toThrow(BadRequestException);
        expect(upload).not.toHaveBeenCalled();
    });

    it.each([
        ['image/jpeg', 'logo.jpg'],
        ['image/png', 'logo.png'],
        ['image/webp', 'logo.webp'],
        ['image/svg+xml', 'logo.svg'],
    ])('should accept valid mime type: %s', async (mimetype, originalname) => {
        const file = makeFile({ mimetype, originalname });
        const updated = makeChurch({ logoUrl: `logos/${originalname}` });

        findById.mockResolvedValue(makeChurch());
        upload.mockResolvedValue({ path: `logos/${originalname}`, filename: originalname, mimetype });
        updateLogo.mockResolvedValue(updated);

        const result = await useCase.execute('church-1', file);

        expect(result.logoUrl).toContain('logos/');
    });
});
