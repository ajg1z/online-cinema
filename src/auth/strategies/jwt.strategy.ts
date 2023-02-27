import { UserModel } from 'src/user/user.model';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from 'nestjs-typegoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export interface PayloadJwt {
  _id: ObjectId;
}

export interface IJwtData {
  _id: ObjectId;
  email: string;
  isAdmin: boolean;
}

export interface IAccessTokenData extends IJwtData {}

export interface IRefreshTokenData extends IJwtData {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET_ACCESS'),
    });
  }

  async validate(payload: PayloadJwt): Promise<IJwtData> {
    const user = await this.userModel.findById(payload._id);
    if (!user) throw new UnauthorizedException('user not found');
    const { _id, email, isAdmin, ...rest } = user;
    return {
      _id,
      email,
      isAdmin,
    };
  }
}
