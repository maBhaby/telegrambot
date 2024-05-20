import { CronJob } from 'cron'
import { DataSource, FindOptionsRelations, In, MoreThan } from 'typeorm'
import { User } from '../entities/user.entity'
import TelegramBot from 'node-telegram-bot-api'
import { MAIN_MESSAGES } from '../config/messages'
import { menuForStartQuiz } from '../config/keyboards'
import { Quiz } from '../entities/quiz.entity'
import {
  QUIZ_VARIANTS,
  QUIZ_VARIANTS_ARR,
} from '../config/commons'
import { format } from 'date-fns'

export class QuizJobsService {

  constructor(
    private readonly db: DataSource,
    private readonly app: TelegramBot
  ) {
    this.planQuizzes()
  }

  planQuizzes() {
    const quizRep = this.db.getRepository(Quiz)

    const job = new CronJob('*/30 * * * * *', async () => {
      const currentActiveQuiz = await quizRep.findOne({where: {status: In(["active", "planned"]) }})

      if (currentActiveQuiz) return

      this.planNextQuizStart();
    })
    job.start()
  }


  async planNextQuizStart(): Promise<void> {
    const userRep = this.db.getRepository(User)
    const quizRep = this.db.getRepository(Quiz)

    const currentActiveQuiz = await this.findNextQuiz();

    if (!currentActiveQuiz) return

    const job = new CronJob(new Date(currentActiveQuiz.startDate), async () => {
      await quizRep.update({id: currentActiveQuiz.id}, {status: "active"});
      this.planQuizStop(currentActiveQuiz);

      const allUsers = await userRep.find({where: {registrationStatus: 'finish'}})

      // Почему map и зачем  await
      allUsers?.forEach((user) => {
        this.app.sendMessage(
          user.telegramId,
          currentActiveQuiz?.quizTitle ?? MAIN_MESSAGES.START_QUIZ,
          {
            reply_markup: {
              inline_keyboard: menuForStartQuiz,
            },
          }
        )
      });
    })
    job.start()
    await quizRep.update({id: currentActiveQuiz.id}, {status: "planned"});
  }

  planQuizStop(quiz: Quiz): void {
    const userRep = this.db.getRepository(User)
    const quizRep = this.db.getRepository(Quiz)

    // Добавь время к дате
    const startDate: Date = new Date(quiz.startDate);
    const stopDate: Date = new Date(startDate.getTime() + 4 * 60 * 1000) // 2 минуты
  
    const job = new CronJob(stopDate, async () => {
      const allUsers = await userRep.find({
        relations: ["userQuizStatus"],
        where: {
          registrationStatus: 'finish',  userQuizStatus: {
            quizId: quiz.id,
          }
        }
      })
     
      await quizRep.update({id: quiz.id}, { status: "finish" })


      // ??????
      if (!allUsers) {
        console.log('ERROR: Попытались отменить пользователям прохождение квиза тк закончилось время на прохождение');
        return 
      }

      /**
        * ! блокировать юзеру прохождение квиза
      */ 
     
      // planNextQuizStart?
    })

    job.start()
  }

  async findNextQuiz(): Promise<Quiz | null> {
    const today = new Date();
    console.log('test', format(today, "yyyy-MM-dd hh:mm:ss"));
    
    const quizRep = this.db.getRepository(Quiz)
    return quizRep.findOne({
      where: {
        status: "initial",
        startDate: MoreThan(format(today, "yyyy-MM-dd HH:mm:ss"))
      },
      order: {
        startDate: "ASC"
      }
    })
  }
}
