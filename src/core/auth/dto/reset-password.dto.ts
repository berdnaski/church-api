import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Token é obrigatório' })
    token: string;

    @ApiProperty({ example: 'NovaSenha123!' })
    @IsNotEmpty({ message: 'Nova senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    newPassword: string;
}
