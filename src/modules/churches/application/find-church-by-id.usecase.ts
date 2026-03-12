import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchRepository } from '../domain/church.repository';
import { Church } from '../domain/church.entity';

@Injectable()
export class FindChurchByIdUseCase {
    constructor(private readonly churchRepository: ChurchRepository) { }

    async execute(id: string): Promise<Church> {
        const church = await this.churchRepository.findById(id);
        if (!church) {
            throw new NotFoundException('Church not found');
        }
        return church;
    }
}
