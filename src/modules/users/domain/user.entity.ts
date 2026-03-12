import { ChurchRole, Gender, MaritalStatus, BaptismStatus } from '@prisma/client';

export class UserProfile {
    id: string;
    userId: string;
    phone: string | null;
    birthDate: Date | null;
    gender: Gender | null;
    maritalStatus: MaritalStatus | null;
    cpf: string | null;
    photoUrl: string | null;
    baptismStatus: BaptismStatus;
    baptismDate: Date | null;
    memberSince: Date | null;
    zipCode: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    createdAt: Date;
    updatedAt: Date;
}

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
    profile?: UserProfile | null;
}
