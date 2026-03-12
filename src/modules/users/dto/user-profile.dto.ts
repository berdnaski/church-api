import { ApiProperty } from '@nestjs/swagger';
import { Gender, MaritalStatus, BaptismStatus } from '@prisma/client';
import { UserProfile } from '../domain/user.entity';

export class UserProfileDto {
    @ApiProperty()
    phone: string | null;

    @ApiProperty()
    birthDate: Date | null;

    @ApiProperty({ enum: Gender })
    gender: Gender | null;

    @ApiProperty({ enum: MaritalStatus })
    maritalStatus: MaritalStatus | null;

    @ApiProperty()
    cpf: string | null;

    @ApiProperty()
    photoUrl: string | null;

    @ApiProperty({ enum: BaptismStatus })
    baptismStatus: BaptismStatus;

    @ApiProperty()
    baptismDate: Date | null;

    @ApiProperty()
    memberSince: Date | null;

    @ApiProperty()
    zipCode: string | null;

    @ApiProperty()
    street: string | null;

    @ApiProperty()
    number: string | null;

    @ApiProperty()
    complement: string | null;

    @ApiProperty()
    neighborhood: string | null;

    @ApiProperty()
    city: string | null;

    @ApiProperty()
    state: string | null;

    static fromEntity(profile: UserProfile): UserProfileDto {
        const dto = new UserProfileDto();
        dto.phone = profile.phone;
        dto.birthDate = profile.birthDate;
        dto.gender = profile.gender;
        dto.maritalStatus = profile.maritalStatus;
        dto.cpf = profile.cpf;
        dto.photoUrl = profile.photoUrl;
        dto.baptismStatus = profile.baptismStatus;
        dto.baptismDate = profile.baptismDate;
        dto.memberSince = profile.memberSince;
        dto.zipCode = profile.zipCode;
        dto.street = profile.street;
        dto.number = profile.number;
        dto.complement = profile.complement;
        dto.neighborhood = profile.neighborhood;
        dto.city = profile.city;
        dto.state = profile.state;
        return dto;
    }
}
