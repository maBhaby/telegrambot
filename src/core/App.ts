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

    const quiz = {
      isActiveQuiz: false,
      quizName: QUIZ_VARIANTS.DAY_1,
      startDate: createDate(2024, 4, 11),
    }

    await this.db
      .getRepository(Quiz)
      .createQueryBuilder('quiz')
      .insert()
      .values([
        quiz,
        {
          isActiveQuiz: false,
          quizName: QUIZ_VARIANTS.DAY_2,

          startDate: createDate(2024, 4, 8)
        },
        {
          isActiveQuiz: false,
          quizName: QUIZ_VARIANTS.DAY_3,

          startDate: createDate(2024, 4, 9)
        },
      ])
      .execute()
      

    const question = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Для каких этапов реаб-ии подходят продукты линейки "Стэдис"',
      questionNumber: 1,
      quiz: quiz,
    }

    const answer1 = {
      text: '1 и 2',
      question,
      isCorrect: false
    }

    const answer2 = {
      text: '2 и 3',
      question,
      isCorrect: false
    }
    const answer3 = {
      text: '3',
      question,
      isCorrect: false
    }
    const answer4 = {
      text: 'для всех этапов',
      question,
      isCorrect: true
    }

    const question2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'В каком приказе при продаже Стэдис необходимо учитывать соответствие кода вида МИ?',
      questionNumber: 2,
      quiz: quiz,
    }

    const answer12 = {
      text: '878н',
      question: question2, 
      isCorrect: true
    }

    const answer22 = {
      text: '90н',
      question: question2,
      isCorrect: false
    }
    const answer32 = {
      text: '788н',
      question: question2,
      isCorrect: true
    }
    const answer42 = {
      text: '931н',
      question: question2,
      isCorrect: false
    }

    const question3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Сколько сенсоров "Нейросенс" включает стандартный комплект для анализа всех параметров ходьбы, в том числе анализа работы всех суставов нижних конечностей:',
      questionNumber: 3,
      quiz: quiz,
    }

    const answer13 = {
      text: '3',
      question: question3, 
      isCorrect: true
    }

    const answer23 = {
      text: '2',
      question: question3,
      isCorrect: false
    }
    const answer33 = {
      text: '7',
      question: question3,
      isCorrect: false
    }
    const answer43 = {
      text: '12',
      question: question3,
      isCorrect: false
    }

    const question4 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Что не является преимуществом системы для стабилографии "Стэдис-Баланс" по сравнению со стабилоплатформами?',
      questionNumber: 4,
      quiz: quiz,
    }

    const answer14 = {
      text: 'мобильность',
      question: question4, 
      isCorrect: false
    }

    const answer24 = {
      text: 'возможность проведения статических и динамических тестов',
      question: question4,
      isCorrect: true
    }
    const answer34 = {
      text: '3д стабилометрия',
      question: question4,
      isCorrect: true
    }
    const answer44 = {
      text: 'возможность расчета угла отклонения корпуса от вертикали',
      question: question4,
      isCorrect: false
    }

    const question5 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Возможно ли дополнять уже имеющуюся у пользователя комплектацию оборудованием/методиками?',
      questionNumber: 5,
      quiz: quiz,
    }

    const answer15 = {
      text: 'Да',
      question: question5, 
      isCorrect: true
    }

    const answer25 = {
      text: 'возможность проведения статических и динамических тестов',
      question: question5,
      isCorrect: false
    }

    const question6 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какое оборудование в составе комплекса НС-Психотест позволяет объективно оценить силу и выносливость?',
      questionNumber: 6,
      quiz: quiz,
    }

    const answer16 = {
      text: 'Координациометр',
      question: question6, 
      isCorrect: false
    }

    const answer26 = {
      text: 'Зрительно-моторный анализатор',
      question: question6,
      isCorrect: false
    }

    const answer36 = {
      text: 'Датчик теппинг-теста',
      question: question6,
      isCorrect: false
    }

    const answer46 = {
      text: 'Динамометр',
      question: question6,
      isCorrect: true
    }

    const question7 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какие специалисты НЕ могут работать с комплексом НС-Психотест?',
      questionNumber: 7,
      quiz: quiz,
    }

    const answer17 = {
      text: 'Психологи (медицинский психолог, психолог в образовании, социальный психолог, нейропсихолог и др.)',
      question: question7, 
      isCorrect: false
    }

    const answer27 = {
      text: 'Врачи-психиатры',
      question: question7,
      isCorrect: false
    }

    const answer37 = {
      text: 'Немедицинские специалисты, занятые в сфере здравоохранения или образования (логопеды, дефектологи)',
      question: question7,
      isCorrect: false
    }

    const answer47 = {
      text: 'Ветеринарные врачи',
      question: question7,
      isCorrect: true
    }

    const answer57 = {
      text: 'Специалисты, занимающиеся сопровождением специалистов экстремального профиля',
      question: question7,
      isCorrect: false
    }

    const answer67 = {
      text: 'Спортивные тренеры и психологи',
      question: question7,
      isCorrect: false
    }

    const answer77 = {
      text: 'Научные сотрудники, проводящие исследования в области психофизиологии',
      question: question7,
      isCorrect: false
    }

    const answer87 = {
      text: 'HR-специалисты',
      question: question7,
      isCorrect: false
    }

    const question8 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'С какими возрастными категориями возможно проводить диагностические исследования с использованием комплекса НС-Психотест?',
      questionNumber: 8,
      quiz: quiz,
    }

    const answer18 = {
      text: 'Только со взрослыми (от 18 лет и старше)',
      question: question8, 
      isCorrect: false
    }

    const answer28 = {
      text: 'Только с детьми (до 18 лет)',
      question: question8,
      isCorrect: false
    }

    const answer38 = {
      text: 'Как с детьми, так и со взрослыми',
      question: question8,
      isCorrect: false
    }


    await this.db
      .getRepository(Question)
      .createQueryBuilder('question')
      .insert()
      .values([
        question,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8
      ])
      .execute()

    await this.db
      .getRepository(QuestionAnswer)
      .createQueryBuilder('questionAnswer')
      .insert()
      .values([
        answer1,
        answer2,
        answer3,
        answer4,
        answer12,
        answer22,
        answer32,
        answer42,
        answer13,
        answer23,
        answer33,
        answer43,
        answer14,
        answer24,
        answer34,
        answer44,
        answer15,
        answer25,
        answer16,
        answer26,
        answer36,
        answer46,
        answer17,
        answer27,
        answer37,
        answer47,
        answer57,
        answer67,
        answer77,
        answer87,
        answer18,
        answer28,
        answer38
      ])
      .execute()
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
