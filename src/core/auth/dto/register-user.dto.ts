import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ example: 'joao-igreja' })
    @IsString()
    @IsNotEmpty()
    churchSlug: string;

    @ApiProperty({ example: 'Novo Membro' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'membro@igreja.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Senha@123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;
}
