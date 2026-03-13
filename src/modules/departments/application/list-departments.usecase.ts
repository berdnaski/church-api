import { Injectable, NotFoundException } from "@nestjs/common";
import { DepartmentRepository } from "../domain/department.repository";
import { Department } from "../domain/department.entity";
import { PaginationParamsDto } from "src/shared/pagination/pagination-params.dto";
import { PaginatedResultDto } from "src/shared/pagination/paginated-result.dto";

@Injectable()
export class ListDepartmentsUseCase {
    constructor(private readonly departmentRepository: DepartmentRepository) { }

    async execute(churchId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<Department>> {
        const departments = await this.departmentRepository.list(churchId, params);

        if (!departments) {
            throw new NotFoundException('Departments not found');
        }

        return departments;
    }
}