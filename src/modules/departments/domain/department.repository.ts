import { Department } from "@prisma/client";
import { PaginatedResultDto } from "src/shared/pagination/paginated-result.dto";
import { PaginationParamsDto } from "src/shared/pagination/pagination-params.dto";

export interface CreateDepartmentInput {
    name: string;
    churchId: string;
    userId: string;
}

export abstract class DepartmentRepository {
    abstract create(data: CreateDepartmentInput): Promise<Department>;
    abstract findByName(name: string, churchId: string): Promise<Department | null>;
    abstract list(churchId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<Department>>;
}