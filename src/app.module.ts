import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import mongoConfig from './config/mongo.config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';
import { RatingModule } from './rating/rating.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoConfig,
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FileModule,
    ActorModule,
    MovieModule,
    RatingModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
