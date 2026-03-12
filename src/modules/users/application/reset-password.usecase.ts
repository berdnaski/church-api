import { Injectable, BadRequestException } from '@nestjs/common';
import { IEmailService } from 'src/shared/email/email.service.interface';
import { passwordResetSuccessEmailTemplate } from '../../../shared/email/templates/password-reset-success-email';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class ResetPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: IEmailService,
        private readonly config: ConfigService,
    ) { }

    async execute(token: string, newPassword: string): Promise<void> {
        const resetRecord = await this.userRepository.findByResetToken(token);

        if (!resetRecord || !resetRecord.user) {
            throw new BadRequestException('Token inválido ou expirado');
        }

        const { user } = resetRecord;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.updatePassword(user.id, hashedPassword);

        await this.userRepository.invalidateToken(token);

        const frontendUrl =
            this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const loginLink = `${frontendUrl}/login`;

        if (user.email && user.name) {
            const emailHtml = passwordResetSuccessEmailTemplate({
                userName: user.name,
                loginLink,
            });

            await this.emailService.sendEmail({
                to: user.email,
                subject: 'Senha Alterada com Sucesso',
                html: emailHtml,
            });
        }
    }
}
