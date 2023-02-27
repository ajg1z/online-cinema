import { JwtAuthGuard } from '../guards/jwt.guard';
import { Roles } from 'src/auth/auth.interface';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';

export const Auth = (role: Roles = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, AdminGuard)
      : UseGuards(JwtAuthGuard),
  );
