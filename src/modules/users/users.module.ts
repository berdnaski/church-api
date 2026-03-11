import { Module } from '@nestjs/common';
import { UserRepository } from './domain/user.repository';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { FindUserByEmailUseCase } from './application/find-user-by-email.usecase';
import { CreateUserUseCase } from './application/create-user.usecase';

@Module({
    providers: [
        { provide: UserRepository, useClass: UserRepositoryImpl },
        FindUserByEmailUseCase,
        CreateUserUseCase,
    ],
    exports: [
        UserRepository,
        FindUserByEmailUseCase,
        CreateUserUseCase,
    ],
})
export class UsersModule { }
