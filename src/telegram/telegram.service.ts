import { Telegraf } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { Telegram } from './telegram.interface';
import telegramConfig from 'src/config/telegram.config';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: Telegram;
  constructor() {
    this.options = telegramConfig();
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(
    msg: string,
    options?: ExtraReplyMessage,
    chatId: string = this.options.chatId,
  ) {
    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: 'HTML',
      ...options,
    });
  }

  async sendPhoto(
    path: string,
    msg: string,
    chatId: string = this.options.chatId,
  ) {
    await this.bot.telegram.sendPhoto(
      chatId,
      path,
      msg
        ? {
            caption: msg,
          }
        : {},
    );
  }
}
