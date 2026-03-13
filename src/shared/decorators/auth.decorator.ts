import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { ChurchRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/jwt/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: ChurchRole[]) {
    return applyDecorators(
        ...(roles.length ? [Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard)] : [UseGuards(JwtAuthGuard)]),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiForbiddenResponse({ description: 'Forbidden resource' })
    );
}
