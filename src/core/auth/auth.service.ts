import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterChurchUseCase } from 'src/modules/churches/application/register-church.usecase';
import { FindUserByEmailUseCase } from 'src/modules/users/application/find-user-by-email.usecase';
import { PasswordHasher } from 'src/core/security/password-hasher';
import { InvalidCredentialsException } from 'src/core/exceptions/invalid-credentials.exception';
import { RegisterChurchDto } from './dto/register-church.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly registerChurchUseCase: RegisterChurchUseCase,
        private readonly findUserByEmail: FindUserByEmailUseCase,
        private readonly passwordHasher: PasswordHasher,
        private readonly jwtService: JwtService,
    ) { }

    async registerChurch(dto: RegisterChurchDto) {
        return this.registerChurchUseCase.execute(dto);
    }

    async login(dto: LoginDto) {
        const user = await this.findUserByEmail.execute(dto.email);
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
