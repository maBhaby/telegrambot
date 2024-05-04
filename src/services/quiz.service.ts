import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { DataSource } from "typeorm";

export class QuizService {
  constructor(private readonly app:TelegramBot, private readonly db: DataSource) {}

  startQuiz(msg: CallbackQuery) {
    this.app.sendMessage(msg.from.id, 'ну полетели, 1й вопрос')
  }
}
