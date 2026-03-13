import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { CreateDepartmentUseCase } from './application/create-department.usecase';
import { DepartmentRepository } from './domain/department.repository';
import { DepartmentRepositoryImpl } from './infrastructure/department.repository.impl';

@Module({
  controllers: [DepartmentsController],
  providers: [
    { provide: DepartmentRepository, useClass: DepartmentRepositoryImpl },
    CreateDepartmentUseCase
  ],
})
export class DepartmentsModule { }
