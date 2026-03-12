import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') as string,
        });
    }

    validate(payload: {
        sub: string;
        email: string;
        role: string;
        churchId: string;
    }): AuthUserPayload {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role as any,
            churchId: payload.churchId,
        };
    }
}
