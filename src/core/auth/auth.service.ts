import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterChurchUseCase } from 'src/modules/churches/application/register-church.usecase';
import { RegisterUserUseCase } from 'src/modules/users/application/register-user.usecase';
import { UserRepository } from 'src/modules/users/domain/user.repository';
import { PasswordHasher } from 'src/core/security/password-hasher';
import { InvalidCredentialsException } from 'src/core/exceptions/invalid-credentials.exception';
import { RegisterChurchDto } from './dto/register-church.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly registerChurchUseCase: RegisterChurchUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly jwtService: JwtService,
    ) { }

    async registerChurch(dto: RegisterChurchDto) {
        return this.registerChurchUseCase.execute(dto);
    }

    async registerUser(dto: RegisterUserDto) {
        return this.registerUserUseCase.execute(dto);
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) throw new InvalidCredentialsException();

        const valid = await this.passwordHasher.compare(dto.password, user.password);
        if (!valid) throw new InvalidCredentialsException();

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            churchId: user.churchId,
        };
        const access_token = await this.jwtService.signAsync(payload);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            churchId: user.churchId,
            access_token,
        };
    }
}
