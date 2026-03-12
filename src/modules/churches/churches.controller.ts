import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';
import { FindChurchByIdUseCase } from './application/find-church-by-id.usecase';

@ApiTags('churches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('churches')
export class ChurchesController {
    constructor(private readonly findChurchById: FindChurchByIdUseCase) { }

    @Get('me')
    @ApiOperation({ summary: 'Get my church details' })
    async getMe(@CurrentUser() user: AuthUserPayload) {
        return this.findChurchById.execute(user.churchId);
    }
}
