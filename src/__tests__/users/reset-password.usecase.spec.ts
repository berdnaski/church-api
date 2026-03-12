import { BadRequestException } from '@nestjs/common';
import { ResetPasswordUseCase } from 'src/modules/users/application/reset-password.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { ChurchRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('src/shared/email/templates/password-reset-success-email', () => ({
    passwordResetSuccessEmailTemplate: jest.fn().mockReturnValue('<html>fake-success-email</html>'),
}));

const makeUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@teste.com',
    password: 'hashed',
    role: ChurchRole.MEMBER,
    isActive: true,
    deletedAt: null,
    churchId: 'church-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

describe('ResetPasswordUseCase', () => {
    const findByResetToken = jest.fn();
    const updatePassword = jest.fn();
    const invalidateToken = jest.fn();
    const sendEmail = jest.fn();
    const get = jest.fn();

    const repo: any = { findByResetToken, updatePassword, invalidateToken };
    const emailService: any = { sendEmail };
    const config: any = { get };

    const useCase = new ResetPasswordUseCase(repo, emailService, config);

    beforeEach(() => {
        (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
    });

    afterEach(() => jest.clearAllMocks());

    it('should update password and invalidate token when token is valid', async () => {
        const user = makeUser();
        findByResetToken.mockResolvedValue({ user });
        get.mockReturnValue('http://localhost:3000');

        await useCase.execute('valid-token', 'newPassword123');

        expect(findByResetToken).toHaveBeenCalledWith('valid-token');
        expect(updatePassword).toHaveBeenCalledWith(user.id, 'new-hashed-password');
        expect(invalidateToken).toHaveBeenCalledWith('valid-token');
        expect(sendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: user.email,
                subject: 'Senha Alterada com Sucesso',
            }),
        );
    });

    it('should throw BadRequestException when token is invalid', async () => {
        findByResetToken.mockResolvedValue(null);

        await expect(useCase.execute('invalid-token', 'newPassword123')).rejects.toThrow(
            BadRequestException,
        );
        expect(updatePassword).not.toHaveBeenCalled();
        expect(sendEmail).not.toHaveBeenCalled();
    });
});
