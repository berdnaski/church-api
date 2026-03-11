import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtModule } from './jwt/auth-jwt.module';
import { ChurchesModule } from 'src/modules/churches/churches.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
    imports: [
        AuthJwtModule,
        ChurchesModule,
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
