import { ApiProperty } from '@nestjs/swagger';
import { Church } from '../domain/church.entity';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class RegisterChurchResponseDto {
    @ApiProperty()
    church: Church;

    @ApiProperty()
    user: UserResponseDto;
}
