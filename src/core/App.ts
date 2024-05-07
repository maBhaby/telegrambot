import TelegramBot from 'node-telegram-bot-api'
import { DataSource } from 'typeorm'

import { mainMenuWithAllCommand } from '../config/keyboards'
// import { getRouter } from '../routes'
import { UserController } from '../controllers'
import { QUIZ_VARIANTS, root } from '../config/commons'
import { resolve } from 'path'
import {
  QuizJobsService,
  QuizService,
  UserService,
} from '../services'
import { QuizController } from '../controllers/quiz.controller'
import { Quiz } from '../entities/quiz.entity'
import { CurrentQuiz } from '../entities/current-quiz.entity'
import { createDate } from '../lib/common.lib'

export class App {
  private readonly _TOKEN: string

  private _app: TelegramBot

  public db: DataSource

  constructor(token: string) {
    this._TOKEN = token
  }

  public getAppInstance() {
    return this._app
  }

  public async initTelegramBot() {
    console.log('this._TOKEN', this._TOKEN)

    this._app = new TelegramBot(this._TOKEN, {
      polling: true,
    })

    // this._setAllCommandToMenu()
    await this._connectToDataBase()
    this._provideControllers()
    this._createJobs()
  }

  // private _setAllCommandToMenu() {
  //   this._app.setMyCommands(mainMenuWithAllCommand)
  // }

  private _createJobs() {
    new QuizJobsService(this.db, this._app)
  }

  private async _connectToDataBase() {
    const appDataSource = new DataSource({
      type: 'sqlite',
      database: `${root}/database/db.sqlite`,
      synchronize: true,
      entities: [
        resolve(
          __dirname,
          '../',
          'entities',
          '*.entity.[t|j]s'
        ),
      ],
      // migrations: [resolve(__dirname, "../", "database", "migrations", "*.[t|j]s")],
      // logging: true,
    })

    this.db = await appDataSource.initialize()

    const currQuiz = { id: 1, name: 'none', activeCount: 0 }

    // await this.db
    //   .getRepository(CurrentQuiz)
    //   .createQueryBuilder('currentQuiz')
    //   .insert()
    //   .values([currQuiz])
    //   .execute()

    // await this.db
    //   .getRepository(Quiz)
    //   .createQueryBuilder('quiz')
    //   .insert()
    //   .values([
    //     {
    //       isActiveQuiz: false,
    //       quizName: QUIZ_VARIANTS.DAY_1,
    //       currentQuiz: currQuiz,
    //       startDate: createDate(2024, 4, 7)
    //     },
    //     {
    //       isActiveQuiz: false,
    //       quizName: QUIZ_VARIANTS.DAY_2,
    //       currentQuiz: currQuiz,
    //       startDate: createDate(2024, 4, 8)
    //     },
    //     {
    //       isActiveQuiz: false,
    //       quizName: QUIZ_VARIANTS.DAY_3,
    //       currentQuiz: currQuiz,
    //       startDate: createDate(2024, 4, 9)
    //     },
    //   ])
    //   .execute()
  }

  private _provideControllers() {
    return {
      userController: new UserController(
        this._app,
        new UserService(this._app, this.db)
      ),
      quizController: new QuizController(
        this._app,
        new QuizService(this._app, this.db)
      ),
    }
  }
}
