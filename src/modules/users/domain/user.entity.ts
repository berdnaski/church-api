import { ChurchRole } from '@prisma/client';

export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: ChurchRole;
    isActive: boolean;
    deletedAt: Date | null;
    churchId: string;
    createdAt: Date;
    updatedAt: Date;
}
