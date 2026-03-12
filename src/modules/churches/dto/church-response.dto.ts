import { ApiProperty } from '@nestjs/swagger';
import { Church } from '../domain/church.entity';

export class ChurchResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty({ required: false, nullable: true })
    address: string | null;

    @ApiProperty({ required: false, nullable: true })
    phone: string | null;

    @ApiProperty({ required: false, nullable: true })
    email: string | null;

    @ApiProperty({ required: false, nullable: true })
    description: string | null;

    @ApiProperty({ required: false, nullable: true, description: 'R2 storage key for the logo' })
    logoUrl: string | null;

    @ApiProperty({ required: false, nullable: true, description: 'Pre-signed URL to display the logo (expires in 1h)' })
    logoSignedUrl: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    static fromEntity(church: Church, logoSignedUrl?: string): ChurchResponseDto {
        const dto = new ChurchResponseDto();
        dto.id = church.id;
        dto.name = church.name;
        dto.slug = church.slug;
        dto.isActive = church.isActive;
        dto.address = church.address;
        dto.phone = church.phone;
        dto.email = church.email;
        dto.description = church.description;
        dto.logoUrl = church.logoUrl;
        dto.logoSignedUrl = logoSignedUrl ?? null;
        dto.createdAt = church.createdAt;
        dto.updatedAt = church.updatedAt;
        return dto;
    }
}
