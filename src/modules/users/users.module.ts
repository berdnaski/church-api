import { Module } from '@nestjs/common';
import { UserRepository } from './domain/user.repository';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { CreateUserUseCase } from './application/create-user.usecase';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { ListUsersUseCase } from './application/list-users.usecase';
import { FindUserByIdUseCase } from './application/find-user-by-id.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { DeleteUserUseCase } from './application/delete-user.usecase';
import { UsersController } from './users.controller';

@Module({
    controllers: [UsersController],
    providers: [
        { provide: UserRepository, useClass: UserRepositoryImpl },
        CreateUserUseCase,
        RegisterUserUseCase,
        ListUsersUseCase,
        FindUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
    ],
    exports: [
        UserRepository,
        CreateUserUseCase,
        RegisterUserUseCase,
        ListUsersUseCase,
        FindUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
    ],
})
export class UsersModule { }
