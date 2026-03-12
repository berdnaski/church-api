import { Module } from '@nestjs/common';
import { UserRepository } from './domain/user.repository';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { CreateUserUseCase } from './application/create-user.usecase';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { ListUsersUseCase } from './application/list-users.usecase';
import { FindUserByIdUseCase } from './application/find-user-by-id.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { DeleteUserUseCase } from './application/delete-user.usecase';
import { UpdateRoleUserUseCase } from './application/update-role-user.usecase';
import { ForgotPasswordUseCase } from './application/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { UpdateUserProfileUseCase } from './application/update-user-profile.usecase';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [
        { provide: UserRepository, useClass: UserRepositoryImpl },
        CreateUserUseCase,
        RegisterUserUseCase,
        ListUsersUseCase,
        FindUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        UpdateRoleUserUseCase,
        ForgotPasswordUseCase,
        ResetPasswordUseCase,
        UpdateUserProfileUseCase,
    ],
    exports: [
        UserRepository,
        CreateUserUseCase,
        RegisterUserUseCase,
        ListUsersUseCase,
        FindUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        UpdateRoleUserUseCase,
        ForgotPasswordUseCase,
        ResetPasswordUseCase,
        UpdateUserProfileUseCase,
    ],
})
export class UsersModule { }
