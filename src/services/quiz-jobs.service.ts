import { CronJob } from "cron";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import TelegramBot from "node-telegram-bot-api";
import { MAIN_MESSAGES } from "../config/messages";
import { menuForStartQuiz } from "../config/keyboards";

export class QuizJobsService {
  constructor(
    private readonly db: DataSource, 
    private readonly app: TelegramBot
  ) {
    this.startQuizzes()
  }

  async startQuizzes () {
    const userRep = this.db.getRepository(User)
    const allUsers = await userRep.find()
    /**
     * 1 после отправки сообщение о прохождении теста сделать запись об этом
     * 2 Придумать как блокировать работу квиза
     */
    const job = new CronJob('*/30 * * * * *', () => {
      console.log('!!!!!new job!!!!!');
      // allUsers.map((user) => {
      //   this.app.sendMessage(user.telegramId, MAIN_MESSAGES.START_QUIZ, {
      //     reply_markup: {
      //       inline_keyboard: menuForStartQuiz
      //     }
      //   })
      // }) 
    })

    job.start()
  }
}
