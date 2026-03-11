import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterChurchDto {
    @ApiProperty({ example: 'Igreja da Graça' })
    @IsString()
    @IsNotEmpty()
    churchName: string;

    @ApiProperty({ example: 'igreja-da-graca' })
    @IsString()
    @IsNotEmpty()
    churchSlug: string;

    @ApiProperty({ example: 'João Silva' })
    @IsString()
    @IsNotEmpty()
    ownerName: string;

    @ApiProperty({ example: 'joao@igreja.com' })
    @IsEmail()
    @IsNotEmpty()
    ownerEmail: string;

    @ApiProperty({ example: 'Senha@123', minLength: 6 })
    @IsString()
    @MinLength(6)
    ownerPassword: string;
}
