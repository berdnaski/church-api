import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterChurchDto } from './dto/register-church.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register-church')
    @ApiOperation({ summary: 'Registrar nova igreja e usuário owner' })
    async registerChurch(@Body() dto: RegisterChurchDto) {
        return this.authService.registerChurch(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Autenticar usuário' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
