import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';
import { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
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
