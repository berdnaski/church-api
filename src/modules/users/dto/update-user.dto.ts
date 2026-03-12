import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ChurchRole } from '@prisma/client';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'João Silva' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ enum: ChurchRole })
    @IsOptional()
    role?: ChurchRole;
}
