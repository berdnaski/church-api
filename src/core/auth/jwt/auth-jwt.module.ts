import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { jwtConstants } from './jwt.constants';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn as any },
        }),
    ],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [JwtModule, JwtAuthGuard],
})
export class AuthJwtModule { }
