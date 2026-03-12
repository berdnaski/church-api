import { Module } from '@nestjs/common';
import { RegisterChurchUseCase } from './application/register-church.usecase';
import { FindChurchByIdUseCase } from './application/find-church-by-id.usecase';
import { ChurchesController } from './churches.controller';
import { ChurchRepository } from './domain/church.repository';
import { ChurchRepositoryImpl } from './infrastructure/church.repository.impl';
import { DeleteChurchUseCase } from './application/delete-church.usecase';

@Module({
    controllers: [ChurchesController],
    providers: [
        RegisterChurchUseCase,
        FindChurchByIdUseCase,
        DeleteChurchUseCase,
        {
            provide: ChurchRepository,
            useClass: ChurchRepositoryImpl,
        },
    ],
    exports: [RegisterChurchUseCase, ChurchRepository],
})
export class ChurchesModule { }
