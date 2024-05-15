import { CronJob } from 'cron'
import { DataSource, FindOptionsRelations } from 'typeorm'
import { User } from '../entities/user.entity'
import TelegramBot from 'node-telegram-bot-api'
import { MAIN_MESSAGES } from '../config/messages'
import { menuForStartQuiz } from '../config/keyboards'
import { Quiz } from '../entities/quiz.entity'
import {
  QUIZ_VARIANTS,
  QUIZ_VARIANTS_ARR,
} from '../config/commons'
import { createDate } from '../lib/common.lib'

export class QuizJobsService {

  constructor(
    private readonly db: DataSource,
    private readonly app: TelegramBot
  ) {
    this.startQuizzes()
    // this.stopQuizzes()
  }


  startQuizzes() {
    const userRep = this.db.getRepository(User)
    const quizRep = this.db.getRepository(Quiz)

    const job = new CronJob('0 */2 * * * *', async () => {
      const today = createDate()
      const currentActiveQuiz = await quizRep.findOne({where: {startDate: today}})
      // console.log('currentActiveQuiz', currentActiveQuiz);
      if (!currentActiveQuiz) return
      await quizRep.update({id: currentActiveQuiz.id}, {isActiveQuiz: true})

      const allUsers = await userRep.find({where: {registrationStatus: 'finish'}})

      allUsers?.map(async (user) => {
        await this.app.sendMessage(
          user.telegramId,
          currentActiveQuiz?.quizTitle ?? MAIN_MESSAGES.START_QUIZ,
          {
            reply_markup: {
              inline_keyboard: menuForStartQuiz,
            },
          }
        )
      })
    })
    job.start()
  }

  stopQuizzes() {
    const userRep = this.db.getRepository(User)
    const quizRep = this.db.getRepository(Quiz)
  
    const job = new CronJob('* 1 * * * *', async () => {
      const currentActiveQuiz = await quizRep.findOne({where: {isActiveQuiz: true}})
      if (!currentActiveQuiz) {
        console.log('ERROR: Не было запущенных квизов');
        return 
      }
      
      const allUsers = await userRep.find({
        // @ts-ignore
        relations: {
          userQuizStatus: {
            quizId: currentActiveQuiz.id,
          }
        },
        where: {
          registrationStatus: 'finish'
        }
      })
     
      await quizRep.update({id: currentActiveQuiz.id}, {isActiveQuiz: false})

      if (!allUsers) {
        console.log('ERROR: Попытались отменить пользователям прохождение квиза тк закончилось время на прохождение');
        return 
      }

      

      /**
        * ! блокировать юзеру прохождение квиза
      */      
    })

    job.start()
  }
}
