import TelegramBot, {
  CallbackQuery,
} from 'node-telegram-bot-api'
import { DataSource } from 'typeorm'
import { quizKeyboard } from '../config/keyboards'
import { Quiz } from '../entities/quiz.entity'

export class QuizService {
  constructor(
    private readonly app: TelegramBot,
    private readonly db: DataSource
  ) {}

  async startQuiz(msg: CallbackQuery) {
    const quizRep = this.db.getRepository(Quiz)
    const activeQuiz = await quizRep.findOne({
      where: {
        isActiveQuiz: true
      },
    })
    console.log('active quiz', activeQuiz)

    if (!activeQuiz) {
      await this.app.sendMessage(
        msg.from.id,
        'Нет активных квизов'
      )

      return 
    }

    this.app.sendMessage(
      msg.from.id,
      'ну полетели, 1й вопрос',
      {
        reply_markup: {
          keyboard: quizKeyboard,
        },
      }
    )
  }
}
