import { CollectionsModelsName } from 'src/constans/models';
import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: CollectionsModelsName.Users,
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
