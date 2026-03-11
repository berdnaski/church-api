import { ApiProperty } from '@nestjs/swagger';
import { ChurchRole } from '@prisma/client';
import { User } from '../domain/user.entity';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: ChurchRole })
    role: ChurchRole;

    @ApiProperty()
    churchId: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    static fromEntity(user: User): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = user.id;
        dto.name = user.name;
        dto.email = user.email;
        dto.role = user.role;
        dto.churchId = user.churchId;
        dto.isActive = user.isActive;
        dto.createdAt = user.createdAt;
        return dto;
    }
}
