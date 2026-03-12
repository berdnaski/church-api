import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';
import { PaginationParamsDto } from 'src/shared/pagination/pagination-params.dto';
import { ListUsersUseCase } from './application/list-users.usecase';
import { FindUserByIdUseCase } from './application/find-user-by-id.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { DeleteUserUseCase } from './application/delete-user.usecase';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResultDto } from 'src/shared/pagination/paginated-result.dto';
import { IsAdminOrSelf } from 'src/shared/decorators/roles.decorator';
import { AdminOrSelfGuard } from 'src/shared/guards/admin-or-self.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async getMe(@CurrentUser() user: AuthUserPayload) {
        const found = await this.findUserByIdUseCase.execute(user.userId, user.churchId);
        return UserResponseDto.fromEntity(found);
    }

    @Get()
    @ApiOperation({ summary: 'List users from my church' })
    @ApiResponse({ status: 200, type: PaginatedResultDto })
    async findAll(
        @CurrentUser() user: AuthUserPayload,
        @Query() params: PaginationParamsDto
    ) {
        return this.listUsersUseCase.execute(user.churchId, params);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a user by ID' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async findOne(
        @Param('id') id: string,
        @CurrentUser() user: AuthUserPayload
    ) {
        const found = await this.findUserByIdUseCase.execute(id, user.churchId);
        return UserResponseDto.fromEntity(found);
    }

    @Patch(':id')
    @IsAdminOrSelf()
    @UseGuards(AdminOrSelfGuard)
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async update(
        @Param('id') id: string,
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: UpdateUserDto
    ) {
        const updated = await this.updateUserUseCase.execute(id, user.churchId, dto, user.userId, user.role);
        return UserResponseDto.fromEntity(updated);
    }

    @Delete(':id')
    @IsAdminOrSelf()
    @UseGuards(AdminOrSelfGuard)
    @ApiOperation({ summary: 'Remove a user (Soft-delete)' })
    @ApiResponse({ status: 204, description: 'User removed successfully' })
    async remove(
        @Param('id') id: string,
        @CurrentUser() user: AuthUserPayload
    ) {
        await this.deleteUserUseCase.execute(id, user.churchId, user.userId, user.role);
    }
}
