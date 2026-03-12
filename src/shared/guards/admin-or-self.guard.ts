import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChurchRole } from '@prisma/client';
import { IS_ADMIN_OR_SELF_KEY } from '../decorators/roles.decorator';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';

@Injectable()
export class AdminOrSelfGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isAdminOrSelf = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_OR_SELF_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!isAdminOrSelf) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as AuthUserPayload;
        const targetId = request.params.id;

        if (!user) {
            return false;
        }

        const isAdmin = ([ChurchRole.OWNER, ChurchRole.PASTOR, ChurchRole.ADMIN] as ChurchRole[]).includes(user.role);
        const isSelf = targetId === user.userId;

        if (isAdmin || isSelf) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to access/modify this resource');
    }
}
