import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';
import { FindChurchByIdUseCase } from './application/find-church-by-id.usecase';
import { IsAdminOrSelf, Roles } from 'src/shared/decorators/roles.decorator';
import { AdminOrSelfGuard } from 'src/shared/guards/admin-or-self.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ChurchRole } from '@prisma/client';
import { DeleteChurchUseCase } from './application/delete-church.usecase';

@ApiTags('churches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('churches')
export class ChurchesController {
    constructor(
        private readonly findChurchByIdUseCase: FindChurchByIdUseCase,
        private readonly deleteChurchUseCase: DeleteChurchUseCase
    ) { }

    @Get('me')
    @ApiOperation({ summary: 'Get my church details' })
    async getMe(@CurrentUser() user: AuthUserPayload) {
        return this.findChurchByIdUseCase.execute(user.churchId);
    }

    @Delete('me')
    @Roles(ChurchRole.OWNER)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Delete my church (Soft-delete)' })
    @ApiResponse({ status: 204, description: 'Church removed successfully' })
    async remove(
        @CurrentUser() user: AuthUserPayload
    ) {
        await this.deleteChurchUseCase.execute(user.churchId);
    }
}
