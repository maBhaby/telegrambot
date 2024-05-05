import { CronJob } from 'cron'
import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import TelegramBot from 'node-telegram-bot-api'
import { MAIN_MESSAGES } from '../config/messages'
import { menuForStartQuiz } from '../config/keyboards'
import { Quiz } from '../entities/quiz.entity'
import { CurrentQuiz } from '../entities/current-quiz.entity'
import {
  QUIZ_VARIANTS,
  QUIZ_VARIANTS_ARR,
} from '../config/commons'

export class QuizJobsService {
  constructor(
    private readonly db: DataSource,
    private readonly app: TelegramBot
  ) {
    this.startQuizzes()
    this.stopQuizzes()
  }

  async startQuizzes() {
    const userRep = this.db.getRepository(User)
    const quizRep = this.db.getRepository(Quiz)
    const currentQuizRep =
      this.db.getRepository(CurrentQuiz)

    /**
     * 1 после отправки сообщение о прохождении теста сделать запись об этом
     * 2 Придумать как блокировать работу квиза
     */
    const job = new CronJob(
      '*/10 * * * * *',
      async () => {
        const currentQuiz = await currentQuizRep.findOneBy({
          id: 1,
        })
        const allUsers = await userRep.find()

        if (
          currentQuiz?.name === 'none' &&
          currentQuiz.activeCount !== -1
        ) {
          await currentQuizRep.update(
            {
              id: 1,
            },
            {
              name: QUIZ_VARIANTS.DAY_1,
            }
          )
          await quizRep.update(
            { quizName: QUIZ_VARIANTS.DAY_1 },
            {
              isActiveQuiz: true,
            }
          )
        } else {
          await quizRep.update(
            { quizName: currentQuiz?.name },
            {
              isActiveQuiz: true,
            }
          )
        }

        const currentQuiz1 = await currentQuizRep.findOneBy(
          { id: 1 }
        )
        console.log(
          '!!!!!startQuizzes - current quiz!!!!!',
          currentQuiz1
        )
        console.log(
          '!!!!!startQuizzes quizRep!!!!!',
          await quizRep.findOneBy({
            quizName: currentQuiz1?.name,
          })
        )

        allUsers.map(async (user) => {
          await this.app.sendMessage(
            user.telegramId,
            MAIN_MESSAGES.START_QUIZ,
            {
              reply_markup: {
                inline_keyboard: menuForStartQuiz,
              },
            }
          )
        })
      },
      async () => {
        const currentQuiz = await currentQuizRep.findOneBy({
          id: 1,
        })
        
        if (currentQuiz?.activeCount === -1) {
          job.stop()
        }
      }
    )

    job.start()
  }

  stopQuizzes() {
    const currentQuizRep =
      this.db.getRepository(CurrentQuiz)
    const quizRep = this.db.getRepository(Quiz)

    /**
     * 1 после отправки сообщение о прохождении теста сделать запись об этом
     * 2 Придумать как блокировать работу квиза
     */
    const job = new CronJob('*/12 * * * * *', async () => {
      const currentQuiz = await currentQuizRep.findOneBy({
        id: 1,
      })

      if (!currentQuiz) {
        console.log('ERROR:', 'Квиз не был активирован')
        return
      }

      await quizRep.update(
        { quizName: currentQuiz.name },
        {
          isActiveQuiz: false,
        }
      )

      if (
        currentQuiz.activeCount >= 0 &&
        currentQuiz.activeCount <= 1
      ) {
        const nextQuiz = currentQuiz.activeCount + 1
        await currentQuizRep.update(
          {
            id: 1,
          },
          {
            activeCount: nextQuiz,
            name: QUIZ_VARIANTS_ARR[nextQuiz],
          }
        )
        console.log(
          '!!!!!stopQuizzes - current quiz!!!!!',
          await currentQuizRep.findOneBy({ id: 1 })
        )
      } else {
        currentQuizRep.update(
          { id: 1 },
          {
            activeCount: -1,
            name: 'none',
          }
        )
        console.log(
          '!!!!!info!!!!!! \n ВСЕ КВИЗЫ ЗАКОНЧИЛИСЬ \n !!!!!info!!!!!!'
        )
      }
    })

    job.start()
  }
}
