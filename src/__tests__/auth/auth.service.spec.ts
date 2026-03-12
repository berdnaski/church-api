import { AuthService } from 'src/core/auth/auth.service';
import { InvalidCredentialsException } from 'src/core/exceptions/invalid-credentials.exception';
import { ChurchRole } from '@prisma/client';

const makeUser = () => ({
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@church.com',
    password: 'hashed_password',
    role: ChurchRole.OWNER,
    isActive: true,
    deletedAt: null,
    churchId: 'church-1',
    createdAt: new Date(),
    updatedAt: new Date(),
});

describe('AuthService', () => {
    const registerChurchUseCase = { execute: jest.fn() };
    const registerUserUseCase = { execute: jest.fn() };
    const userRepository = { findByEmail: jest.fn() };
    const passwordHasher = { hash: jest.fn(), compare: jest.fn() };
    const jwtService = { signAsync: jest.fn() };

    const service = new AuthService(
        registerChurchUseCase as any,
        registerUserUseCase as any,
        userRepository as any,
        passwordHasher as any,
        jwtService as any,
    );

    afterEach(() => jest.clearAllMocks());

    describe('registerChurch', () => {
        it('should delegate to RegisterChurchUseCase', async () => {
            const dto: any = { churchName: 'Igreja', churchSlug: 'igreja' };
            const expected = { church: {}, user: {} };
            registerChurchUseCase.execute.mockResolvedValue(expected);

            const result = await service.registerChurch(dto);

            expect(result).toEqual(expected);
            expect(registerChurchUseCase.execute).toHaveBeenCalledWith(dto);
        });
    });

    describe('registerUser', () => {
        it('should delegate to RegisterUserUseCase', async () => {
            const dto: any = { name: 'João', email: 'joao@c.com', password: '123', churchSlug: 'ig' };
            registerUserUseCase.execute.mockResolvedValue({ id: 'user-1' });

            const result = await service.registerUser(dto);

            expect(registerUserUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toMatchObject({ id: 'user-1' });
        });
    });

    describe('login', () => {
        const dto = { email: 'joao@church.com', password: 'senha123' };

        it('should return an access_token on valid credentials', async () => {
            userRepository.findByEmail.mockResolvedValue(makeUser());
            passwordHasher.compare.mockResolvedValue(true);
            jwtService.signAsync.mockResolvedValue('jwt.token.here');

            const result = await service.login(dto);

            expect(result.access_token).toBe('jwt.token.here');
            expect(result.email).toBe('joao@church.com');
        });

        it('should throw InvalidCredentialsException when user is not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);

            await expect(service.login(dto)).rejects.toThrow(InvalidCredentialsException);
            expect(passwordHasher.compare).not.toHaveBeenCalled();
        });

        it('should throw InvalidCredentialsException when password is wrong', async () => {
            userRepository.findByEmail.mockResolvedValue(makeUser());
            passwordHasher.compare.mockResolvedValue(false);

            await expect(service.login(dto)).rejects.toThrow(InvalidCredentialsException);
            expect(jwtService.signAsync).not.toHaveBeenCalled();
        });
    });
});
