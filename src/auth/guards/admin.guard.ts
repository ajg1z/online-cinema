import { IJwtData } from './../strategies/jwt.strategy';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface IUserField {
  user: IJwtData;
}

export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IUserField>();

    const user = request.user;

    if (!user || !user.isAdmin)
      throw new ForbiddenException('You not have rights');

    return user.isAdmin;
  }
}
