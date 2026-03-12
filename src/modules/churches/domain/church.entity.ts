export class Church {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    address: string | null;
    phone: string | null;
    email: string | null;
    description: string | null;
    logoUrl: string | null;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
