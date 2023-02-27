import { UserModel } from 'src/user/user.model';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserField } from 'src/auth/guards/admin.guard';

export const User = createParamDecorator(
  (field: keyof UserModel = null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IUserField>();
    const user = request.user;
    if (!field) return user;
    return user[field];
  },
);
