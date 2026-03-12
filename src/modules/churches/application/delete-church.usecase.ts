import { Injectable, NotFoundException } from "@nestjs/common";
import { ChurchRepository } from "../domain/church.repository";

@Injectable()
export class DeleteChurchUseCase {
  constructor(
    private readonly churchRepository: ChurchRepository
  ) {}

  async execute(id: string): Promise<void> {
      const church = await this.churchRepository.findById(id);
      if (!church) {
        throw new NotFoundException('Church not found');
      }

      await this.churchRepository.delete(id);
  }
}