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
import { createDate } from '../lib/common.lib'
import { Question } from '../entities/question.entity'
import { QuestionStatusTypes } from '../interfaces/common.interfaces'
import { QuestionAnswer } from '../entities/question-answer.entity'

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

    //  const quiz = {
    //   isActiveQuiz: false,
    //   quizName: QUIZ_VARIANTS.DAY_1,
    //   startDate: createDate(2024, 4, 11),
    // }

    // await this.db
    //   .getRepository(Quiz)
    //   .createQueryBuilder('quiz')
    //   .insert()
    //   .values([
    //     quiz,
    //     {
    //       isActiveQuiz: false,
    //       quizName: QUIZ_VARIANTS.DAY_2,

    //       startDate: createDate(2024, 4, 8)
    //     },
    //     {
    //       isActiveQuiz: false,
    //       quizName: QUIZ_VARIANTS.DAY_3,

    //       startDate: createDate(2024, 4, 9)
    //     },
    //   ])
    //   .execute()
      

    // const question = {
    //   questionStatus: 'unread' as QuestionStatusTypes,
    //   question: 'Столица России?',
    //   questionNumber: 1,
    //   quiz: quiz,
    // }

    // const answer1 = {
    //   text: 'Москва',
    //   question,
    //   isCorrect: true
    // }

    // const answer2 = {
    //   text: 'Беларусь',
    //   question,
    //   isCorrect: false
    // }
    // const answer3 = {
    //   text: 'Жопа',
    //   question,
    //   isCorrect: false
    // }
    // const answer4 = {
    //   text: 'НеДома',
    //   question,
    //   isCorrect: false
    // }

    // const question2 = {
    //   questionStatus: 'unread' as QuestionStatusTypes,
    //   question: 'Кто такой Рома Жёлудь?',
    //   questionNumber: 2,
    //   quiz: quiz,
    // }

    // const answer12 = {
    //   text: 'Хз',
    //   question: question2, 
    //   isCorrect: true
    // }

    // const answer22 = {
    //   text: 'Без Понятия',
    //   question: question2,
    //   isCorrect: false
    // }
    // const answer32 = {
    //   text: 'Вообще',
    //   question: question2,
    //   isCorrect: false
    // }
    // const answer42 = {
    //   text: 'Не пон',
    //   question: question2,
    //   isCorrect: false
    // }

    // await this.db
    //   .getRepository(Question)
    //   .createQueryBuilder('question')
    //   .insert()
    //   .values([
    //     question,
    //     question2
    //   ])
    //   .execute()

    // await this.db
    //   .getRepository(QuestionAnswer)
    //   .createQueryBuilder('questionAnswer')
    //   .insert()
    //   .values([
    //     answer1,
    //     answer2,
    //     answer3,
    //     answer4,
    //     answer12,
    //     answer22,
    //     answer32,
    //     answer42
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
