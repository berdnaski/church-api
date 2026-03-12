import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { UserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";
import { UpdateRoleDto } from "../dto/update-role.dto";

@Injectable()
export class UpdateRoleUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: string, churchId: string, dto: UpdateRoleDto): Promise<User> {
        const user = await this.userRepository.findById(id, churchId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!dto.role) {
            throw new BadRequestException('Role is required');
        }



        return this.userRepository.updateRole(id, churchId, dto.role);
    }
}