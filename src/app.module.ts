import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';
import { SecurityModule } from './core/security/security.module';
import { AuthModule } from './core/auth/auth.module';
import { ChurchesModule } from './modules/churches/churches.module';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthGuard } from './core/auth/jwt/jwt.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { AdminOrSelfGuard } from './shared/guards/admin-or-self.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SecurityModule,
    ChurchesModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RolesGuard,
    AdminOrSelfGuard,
  ],
})
export class AppModule { }
