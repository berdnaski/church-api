import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { PaginationParamsDto } from 'src/shared/pagination/pagination-params.dto';
import { PaginatedResultDto } from 'src/shared/pagination/paginated-result.dto';
import { User } from '../domain/user.entity';

@Injectable()
export class ListUsersUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(churchId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<User>> {
        return this.userRepository.list(churchId, params);
    }
}
