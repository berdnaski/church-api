import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterChurchDto } from './dto/register-church.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register-church')
    @ApiOperation({ summary: 'New church registrar and owner user.' })
    async registerChurch(@Body() dto: RegisterChurchDto) {
        return this.authService.registerChurch(dto);
    }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Registering a new user in a church via slug' })
    async register(@Body() dto: RegisterUserDto) {
        return this.authService.registerUser(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate user' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
