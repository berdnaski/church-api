import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ChurchRole } from '@prisma/client';

export interface AuthUserPayload {
    userId: string;
    email: string;
    role: ChurchRole;
    churchId: string;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthUserPayload => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.user as AuthUserPayload;
    },
);
