import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
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
import { UpdateChurchDto } from './dto/update-church.dto';
import { UpdateChurchUseCase } from './application/update-church.usecase';

@ApiTags('churches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('churches')
export class ChurchesController {
    constructor(
        private readonly findChurchByIdUseCase: FindChurchByIdUseCase,
        private readonly deleteChurchUseCase: DeleteChurchUseCase,
        private readonly updateChurchUseCase: UpdateChurchUseCase
    ) { }

    @Get('me')
    @ApiOperation({ summary: 'Get my church details' })
    async getMe(@CurrentUser() user: AuthUserPayload) {
        return this.findChurchByIdUseCase.execute(user.churchId);
    }

    @Get(':id')
    @IsAdminOrSelf()
    @UseGuards(AdminOrSelfGuard)
    @ApiOperation({ summary: 'Get church details by ID' })
    async findOne(@Param('id') id: string) {
        return this.findChurchByIdUseCase.execute(id);
    }

    @Delete(':id')
    @IsAdminOrSelf()
    @Roles(ChurchRole.OWNER)
    @UseGuards(RolesGuard, AdminOrSelfGuard)
    @ApiOperation({ summary: 'Delete a church (Soft-delete)' })
    @ApiResponse({ status: 204, description: 'Church removed successfully' })
    async remove(
        @Param('id') id: string
    ) {
        await this.deleteChurchUseCase.execute(id);
    }

    @Put(':id')
    @IsAdminOrSelf()
    @Roles(ChurchRole.OWNER, ChurchRole.PASTOR, ChurchRole.ADMIN)
    @UseGuards(RolesGuard, AdminOrSelfGuard)
    @ApiOperation({ summary: 'Update a church' })
    @ApiResponse({ status: 200, description: 'Church updated successfully' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateChurchDto
    ) {
        return this.updateChurchUseCase.execute(id, dto);
    }
}
