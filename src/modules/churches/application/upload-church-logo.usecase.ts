import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChurchRepository } from '../domain/church.repository';
import { StorageService } from 'src/shared/domain/services/storage.service';
import { Church } from '../domain/church.entity';

@Injectable()
export class UploadChurchLogoUseCase {
    constructor(
        private readonly churchRepository: ChurchRepository,
        private readonly storageService: StorageService,
    ) { }

    async execute(churchId: string, file: Express.Multer.File): Promise<Church> {
        const church = await this.churchRepository.findById(churchId);
        if (!church) {
            throw new NotFoundException('Church not found');
        }

        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, PNG, WebP and SVG are allowed.');
        }

        if (church.logoUrl) {
            await this.storageService.delete(church.logoUrl);
        }

        const { path } = await this.storageService.upload({
            buffer: file.buffer,
            filename: file.originalname,
            mimetype: file.mimetype,
            folder: 'logos',
        });

        return this.churchRepository.updateLogo(churchId, path);
    }
}
