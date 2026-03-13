import { Department } from "@prisma/client";

export interface CreateDepartmentInput {
    name: string;
    churchId: string;
    userId: string;
}

export abstract class DepartmentRepository {
    abstract create(data: CreateDepartmentInput): Promise<Department>;
    abstract findByName(name: string, churchId: string): Promise<Department | null>;
}