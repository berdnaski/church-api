import { DepartmentRole } from "@prisma/client";

export class DepartmentMember {
    id: string;
    departmentId: string;
    userId: string;
    role: DepartmentRole;
    createdAt: Date;
    updatedAt: Date;
}