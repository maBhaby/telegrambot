import TelegramBot, { Message } from 'node-telegram-bot-api'
import { User } from '../entities/user.entity'

export class UserService {
  constructor(private readonly _app: TelegramBot) {}

  async start(msg: Message) {
    await this._app.sendMessage(
      msg.chat.id,
      'Привет дорогой друг! Нажми зарегаться чтоб принять участие в опросе'
    )
  }
}
