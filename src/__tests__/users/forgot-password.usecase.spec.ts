import { ForgotPasswordUseCase } from 'src/modules/users/application/forgot-password.usecase';
import { User } from 'src/modules/users/domain/user.entity';
import { ChurchRole } from '@prisma/client';

jest.mock('uuid', () => ({ v4: () => 'fake-uuid-token' }));
jest.mock('src/shared/email/templates/forgot-password-email', () => ({
    forgotPasswordEmailTemplate: jest.fn().mockReturnValue('<html>fake-email</html>'),
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

describe('ForgotPasswordUseCase', () => {
    const findByEmail = jest.fn();
    const createResetToken = jest.fn();
    const sendEmail = jest.fn();
    const get = jest.fn();

    const repo: any = { findByEmail, createResetToken };
    const emailService: any = { sendEmail };
    const config: any = { get };

    const useCase = new ForgotPasswordUseCase(repo, emailService, config);

    afterEach(() => jest.clearAllMocks());

    it('should generate token and send email when user exists', async () => {
        const user = makeUser();
        findByEmail.mockResolvedValue(user);
        get.mockReturnValue('http://localhost:3000');

        await useCase.execute('joao@teste.com');

        expect(findByEmail).toHaveBeenCalledWith('joao@teste.com');
        expect(createResetToken).toHaveBeenCalledWith(
            user.id,
            expect.any(String),
            expect.any(Date),
        );
        expect(sendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: user.email,
                subject: 'Recuperação de Senha',
            }),
        );
    });

    it('should do nothing when user does not exist', async () => {
        findByEmail.mockResolvedValue(null);

        await useCase.execute('missing@teste.com');

        expect(createResetToken).not.toHaveBeenCalled();
        expect(sendEmail).not.toHaveBeenCalled();
    });
});
