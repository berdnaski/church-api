import { Module } from '@nestjs/common';
import { RegisterChurchUseCase } from './application/register-church.usecase';

@Module({
    providers: [RegisterChurchUseCase],
    exports: [RegisterChurchUseCase],
})
export class ChurchesModule { }
