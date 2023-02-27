import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './dto/refresh-token.dto';
import { OutputUser } from './entities/output-user';
import { ObjectId } from 'mongodb';
import { AuthDto } from './dto/auth.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { hash, genSalt, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IRefreshTokenData } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly JwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: AuthDto) {
    const checkUser = await this.UserModel.findOne({ email: payload.email });
    if (checkUser)
      throw new BadRequestException(
        'User with this email already exists in the system',
      );
    const salt = await genSalt(4);
    const hashPassword = await hash(payload.password, salt);

    const user = new this.UserModel({
      email: payload.email,
      password: hashPassword,
    });

    await user.save();

    const tokens = await this.createTokens(user._id);

    return {
      user: new OutputUser(user),
      ...tokens,
    };
  }

  async refreshToken({ refreshToken }: RefreshToken) {
    if (!refreshToken) return new UnauthorizedException('Unauthorized');

    const isValidRefreshToken =
      await this.JwtService.verifyAsync<IRefreshTokenData>(refreshToken, {
        secret: this.configService.get('JWT_SECRET_REFRESH'),
      });

    if (!isValidRefreshToken) return new UnauthorizedException('Unauthorized');

    const user = await this.UserModel.findById(isValidRefreshToken._id);

    if (!user) return new UnauthorizedException('user not found');
    const tokens = await this.createTokens(isValidRefreshToken._id);

    return {
      user: new OutputUser(user),
      ...tokens,
    };
  }

  async login(payload: AuthDto) {
    const user = await this.validateUser(payload);

    const tokens = await this.createTokens(user._id);

    return {
      user: new OutputUser(user),
      ...tokens,
    };
  }

  async validateUser(payload: AuthDto) {
    const user = await this.UserModel.findOne({ email: payload.email });
    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await compare(payload.password, user.password);
    if (!isValidPassword) throw new BadRequestException('password not valid');
    return user;
  }

  async createTokens(userId: ObjectId) {
    const refreshTokenData = { _id: userId };
    const accessTokenData = { _id: userId };

    const refreshToken = await this.JwtService.signAsync(refreshTokenData, {
      expiresIn: '15d',
      secret: this.configService.get('JWT_SECRET_REFRESH'),
    });

    const accessToken = await this.JwtService.signAsync(accessTokenData, {
      expiresIn: '1h',
      secret: this.configService.get('JWT_SECRET_ACCESS'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
