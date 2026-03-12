import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { IEmailService } from 'src/shared/email/email.service.interface';
import { forgotPasswordEmailTemplate } from '../../../shared/email/templates/forgot-password-email';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: IEmailService,
        private readonly config: ConfigService,
    ) { }

    async execute(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return;
        }

        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);

        await this.userRepository.createResetToken(user.id, token, expiresAt);

        const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        const emailHtml = forgotPasswordEmailTemplate({
            userName: user.name,
            resetLink,
        });

        await this.emailService.sendEmail({
            to: user.email,
            subject: 'Recuperação de Senha',
            html: emailHtml,
        });
    }
}
