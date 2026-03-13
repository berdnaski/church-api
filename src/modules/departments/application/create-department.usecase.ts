import { Injectable, NotFoundException } from "@nestjs/common";
import { DepartmentRepository, CreateDepartmentInput } from "../domain/department.repository";
import { Department } from "../domain/department.entity";

@Injectable()
export class CreateDepartmentUseCase {
    constructor(private readonly departmentRepository: DepartmentRepository) { }

    async execute(data: CreateDepartmentInput): Promise<Department> {
        const department = await this.departmentRepository.findByName(data.name, data.churchId);
        if (department) {
            throw new NotFoundException('Department already exists');
        }

        return this.departmentRepository.create(data);
    }
}