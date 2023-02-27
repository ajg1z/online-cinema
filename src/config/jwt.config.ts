import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get('TOKEN_SECRET'),
  };
};
