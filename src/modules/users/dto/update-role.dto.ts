import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ChurchRole } from '@prisma/client';

export class UpdateRoleDto {
    @ApiPropertyOptional({
        enum: ChurchRole,
        example: ChurchRole.ADMIN,
        description: 'Novo cargo do usuário no sistema'
    })
    @IsOptional()
    @IsEnum(ChurchRole)
    role?: ChurchRole;
}
