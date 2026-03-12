import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsNumberString, Length } from 'class-validator';
import { Gender, MaritalStatus, BaptismStatus } from '@prisma/client';

export class UpdateUserProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @ApiPropertyOptional({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ enum: MaritalStatus })
    @IsOptional()
    @IsEnum(MaritalStatus)
    maritalStatus?: MaritalStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    @Length(11, 11)
    cpf?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    photoUrl?: string;

    @ApiPropertyOptional({ enum: BaptismStatus })
    @IsOptional()
    @IsEnum(BaptismStatus)
    baptismStatus?: BaptismStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    baptismDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    memberSince?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    zipCode?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    street?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    number?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    complement?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    neighborhood?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    state?: string;
}
