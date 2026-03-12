import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchRepository } from '../domain/church.repository';
import { StorageService } from 'src/shared/domain/services/storage.service';
import { ChurchResponseDto } from '../dto/church-response.dto';

@Injectable()
export class FindChurchByIdUseCase {
    constructor(
        private readonly churchRepository: ChurchRepository,
        private readonly storageService: StorageService,
    ) { }

    async execute(id: string): Promise<ChurchResponseDto> {
        const church = await this.churchRepository.findById(id);
        if (!church) {
            throw new NotFoundException('Church not found');
        }

        let logoSignedUrl: string | undefined;
        if (church.logoUrl) {
            const { signedUrl } = await this.storageService.getUrl(church.logoUrl);
            logoSignedUrl = signedUrl;
        }

        return ChurchResponseDto.fromEntity(church, logoSignedUrl);
    }
}
