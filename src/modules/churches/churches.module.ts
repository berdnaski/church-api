import { Module } from '@nestjs/common';
import { RegisterChurchUseCase } from './application/register-church.usecase';
import { FindChurchByIdUseCase } from './application/find-church-by-id.usecase';
import { ChurchesController } from './churches.controller';
import { ChurchRepository } from './domain/church.repository';
import { ChurchRepositoryImpl } from './infrastructure/church.repository.impl';
import { DeleteChurchUseCase } from './application/delete-church.usecase';
import { UpdateChurchUseCase } from './application/update-church.usecase';
import { UploadChurchLogoUseCase } from './application/upload-church-logo.usecase';
import { StorageModule } from 'src/shared/infrastructure/storage.module';

@Module({
    imports: [StorageModule],
    controllers: [ChurchesController],
    providers: [
        RegisterChurchUseCase,
        FindChurchByIdUseCase,
        DeleteChurchUseCase,
        UpdateChurchUseCase,
        UploadChurchLogoUseCase,
        {
            provide: ChurchRepository,
            useClass: ChurchRepositoryImpl,
        },
    ],
    exports: [RegisterChurchUseCase, ChurchRepository],
})
export class ChurchesModule { }
