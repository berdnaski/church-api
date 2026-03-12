import { ChurchRole } from '@prisma/client';
import { User, UserProfile } from './user.entity';
import { PaginatedResultDto } from 'src/shared/pagination/paginated-result.dto';
import { PaginationParamsDto } from 'src/shared/pagination/pagination-params.dto';

export abstract class UserRepository {
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(id: string, churchId: string): Promise<User | null>;
    abstract list(churchId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<User>>;
    abstract update(id: string, churchId: string, data: Partial<User>): Promise<User>;
    abstract delete(id: string, churchId: string): Promise<User>;
    abstract create(data: {
        name: string;
        email: string;
        password: string;
        role?: ChurchRole;
        churchId: string;
    }): Promise<User>;
    abstract updateRole(id: string, churchId: string, role: ChurchRole): Promise<User>;
    abstract createResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
    abstract findByResetToken(token: string): Promise<{ user: User } | null>;
    abstract updatePassword(id: string, passwordHash: string): Promise<void>;
    abstract invalidateToken(token: string): Promise<void>;
    abstract updateProfile(userId: string, data: Partial<UserProfile>): Promise<User>;
}
