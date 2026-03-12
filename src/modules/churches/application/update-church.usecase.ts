import { Injectable, NotFoundException } from "@nestjs/common";
import { ChurchRepository } from "../domain/church.repository";
import { UpdateChurchDto } from "../dto/update-church.dto";
import { Church } from "../domain/church.entity";

@Injectable()
export class UpdateChurchUseCase {
    constructor(private readonly churchRepository: ChurchRepository) { }

    async execute(id: string, dto: UpdateChurchDto): Promise<Church> {
        const church = await this.churchRepository.findById(id);

        if (!church) {
            throw new NotFoundException('Church not found');
        }

        return this.churchRepository.update(id, dto);
    }
}