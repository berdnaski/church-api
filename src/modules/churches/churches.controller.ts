import { Body, Controller, Delete, Get, Param, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';
import { FindChurchByIdUseCase } from './application/find-church-by-id.usecase';
import { IsAdminOrSelf } from 'src/shared/decorators/roles.decorator';
import { AdminOrSelfGuard } from 'src/shared/guards/admin-or-self.guard';
import { ChurchRole } from '@prisma/client';
import { DeleteChurchUseCase } from './application/delete-church.usecase';
import { UpdateChurchDto } from './dto/update-church.dto';
import { UpdateChurchUseCase } from './application/update-church.usecase';
import { UploadChurchLogoUseCase } from './application/upload-church-logo.usecase';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { ADMIN_ROLES } from 'src/shared/constants/roles.constants';

@ApiTags('churches')
@Controller('churches')
export class ChurchesController {
    constructor(
        private readonly findChurchByIdUseCase: FindChurchByIdUseCase,
        private readonly deleteChurchUseCase: DeleteChurchUseCase,
        private readonly updateChurchUseCase: UpdateChurchUseCase,
        private readonly uploadChurchLogoUseCase: UploadChurchLogoUseCase,
    ) { }

    @Get('me')
    @Auth()
    @ApiOperation({ summary: 'Get my church details' })
    async getMe(@CurrentUser() user: AuthUserPayload) {
        return this.findChurchByIdUseCase.execute(user.churchId);
    }

    @Get(':id')
    @IsAdminOrSelf()
    @Auth()
    @UseGuards(AdminOrSelfGuard)
    @ApiOperation({ summary: 'Get church details by ID' })
    async findOne(@Param('id') id: string) {
        return this.findChurchByIdUseCase.execute(id);
    }

    @Delete(':id')
    @IsAdminOrSelf()
    @Auth(ChurchRole.OWNER)
    @UseGuards(AdminOrSelfGuard)
    @ApiOperation({ summary: 'Delete a church (Soft-delete)' })
    @ApiResponse({ status: 204, description: 'Church removed successfully' })
    async remove(
        @Param('id') id: string
    ) {
        await this.deleteChurchUseCase.execute(id);
    }

    @Put(':id')
    @IsAdminOrSelf()
    @Auth(...ADMIN_ROLES)
    @UseGuards(AdminOrSelfGuard)
    @ApiOperation({ summary: 'Update a church' })
    @ApiResponse({ status: 200, description: 'Church updated successfully' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateChurchDto
    ) {
        return this.updateChurchUseCase.execute(id, dto);
    }

    @Patch(':id/logo')
    @IsAdminOrSelf()
    @Auth(...ADMIN_ROLES)
    @UseGuards(AdminOrSelfGuard)
    @UseInterceptors(FileInterceptor('file', { storage: undefined }))
    @ApiOperation({ summary: 'Upload church logo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @ApiResponse({ status: 200, description: 'Logo uploaded successfully' })
    async uploadLogo(
        @Param('id') id: string,
        @CurrentUser() user: AuthUserPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadChurchLogoUseCase.execute(id, file);
    }
}
