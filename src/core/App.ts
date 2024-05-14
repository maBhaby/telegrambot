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
      startDate: createDate(2024, 4, 23),
    }

    const quiz2 = {
        isActiveQuiz: false,
        quizName: QUIZ_VARIANTS.DAY_2,
        startDate: createDate(2024, 4, 22)
      }

    await this.db
      .getRepository(Quiz)
      .createQueryBuilder('quiz')
      .insert()
      .values([
        quiz,
        quiz2,
        {
          isActiveQuiz: false,
          quizName: QUIZ_VARIANTS.DAY_3,

          startDate: createDate(2024, 4, 9)
        },
      ])
      .execute()
      

    const question = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Реабилитация в РФ»</b> \n\n Для каких этапов реабилитации подходят продукты линейки "Стэдис"?',
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
      isCorrect: false
    }
    const answer44 = {
      text: 'возможность расчета угла отклонения корпуса от вертикали',
      question: question4,
      isCorrect: false
    }

    const question5 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Психофизиология»</b> \n\n Возможно ли дополнять уже имеющуюся у пользователя комплектацию оборудованием/методиками?',
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
      isCorrect: true
    }

    const question9 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Неинвазивная нейромодуляция (ТМС, ПМС, TDCS)»</b> \n\n Выберите верное утверждение: бифазный магнитный стимулятор с двойным (угловым) индуктором…',
      questionNumber: 9,
      quiz: quiz,
    }

    const answer19 = {
      text: 'Не подходит для диагностической ТМС',
      question: question9, 
      isCorrect: false
    }

    const answer29 = {
      text: 'Является оптимальным для проведения сеансов ритмической периферической МС',
      question: question9,
      isCorrect: false
    }

    const answer39 = {
      text: 'Обладает избирательностью действия на определенную группу нейронов',
      question: question9,
      isCorrect: false
    }

    const answer49 = {
      text: 'Является оптимальным для рТМС',
      question: question9,
      isCorrect: true
    }

    const answer59 = {
      text: 'Не подходит для проведения сеансов терапевтической ТМС',
      question: question9,
      isCorrect: false
    }

    const question10 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Основным преимуществом программы «Нейро-МС.NET» НЕ является',
      questionNumber: 10,
      quiz: quiz,
    }

    const answer110 = {
      text: 'Наличие полного набора тестов для проведения диагностической ТМС',
      question: question10, 
      isCorrect: true
    }

    const answer210 = {
      text: 'Встроенные в программу протоколы стимуляции, список которых регулярно пополняется',
      question: question10,
      isCorrect: false
    }

    const answer310 = {
      text: 'Наличие интерактивных подсказок по позиционированию индукторов',
      question: question10,
      isCorrect: false
    }

    const answer410 = {
      text: 'Возможность вести картотеки пациентов и хранить информацию о проводимом лечении в базе данных',
      question: question10,
      isCorrect: false
    }


    const question11 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какие виды стимуляции можно проводить с использованием прибора «Нейростим»?',
      questionNumber: 11,
      quiz: quiz,
    }

    const answer111 = {
      text: 'Электромагнитная стимуляция, Стимуляция постоянным током малой интенсивности',
      question: question11, 
      isCorrect: false
    }

    const answer211 = {
      text: 'Нейрофармакологическая стимуляция, Стимуляция постоянным током малой интенсивности',
      question: question11,
      isCorrect: false
    }

    const answer311 = {
      text: 'Стимуляция током пользовательской формы, Стимуляция постоянным током малой интенсивности',
      question: question11,
      isCorrect: true
    }

    const answer411 = {
      text: 'Магнитно-резонансная стимуляция, Стимуляция постоянным током малой интенсивности',
      question: question11,
      isCorrect: false
    }

    const question12 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Системы каких производителей, поставляемых на рынок РФ, могут использоваться для проведения магнитной стимуляции с нейронавигацией в рамках оказания высокотехнологичной медицинской помощи (ВМП)? ',
      questionNumber: 12,
      quiz: quiz,
    }

    const answer112 = {
      text: 'REMED, Нейрософт',
      question: question12, 
      isCorrect: false
    }

    const answer212 = {
      text: 'Nextim, Нейрософт',
      question: question12,
      isCorrect: true
    }

    const answer312 = {
      text: 'BTL, Нейрософт',
      question: question12,
      isCorrect: false
    }

    const answer412 = {
      text: 'Magstim, Нейрософт',
      question: question12,
      isCorrect: false
    }

    const question13 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: ' <b>Секция «Кардиореабилитация»</b> \n\n Какой НЕ может быть кардиореабилитация?',
      questionNumber: 13,
      quiz: quiz,
    }

    const answer113 = {
      text: 'Двигательная',
      question: question13, 
      isCorrect: true
    }

    const answer213 = {
      text: 'Амбулаторная',
      question: question13,
      isCorrect: false
    }

    const answer313 = {
      text: 'В условиях стационара',
      question: question13,
      isCorrect: false
    }

    const question14 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какой параметр регулируется в безопасном режиме в системе «Мультитренер»?',
      questionNumber: 14,
      quiz: quiz,
    }

    const answer114 = {
      text: 'Удерживается ЧСС в заданном диапазоне',
      question: question14, 
      isCorrect: true
    }

    const answer214 = {
      text: 'Удерживается амплитуда ЭКГ в заданном диапазоне',
      question: question14,
      isCorrect: false
    }

    const answer314 = {
      text: 'Удерживается нагрузка в заданном диапазоне',
      question: question14,
      isCorrect: false
    }


    const question15 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'С помощью какого оборудования можно провести тест 6-минутной ходьбы?',
      questionNumber: 15,
      quiz: quiz,
    }

    const answer115 = {
      text: 'Мультитренер',
      question: question15, 
      isCorrect: false
    }

    const answer215 = {
      text: 'Аккордикс',
      question: question15,
      isCorrect: true
    }

    const question16 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'По какому приказу продается «Мультитренер»?',
      questionNumber: 16,
      quiz: quiz,
    }

    const answer116 = {
      text: '1379н',
      question: question16, 
      isCorrect: false
    }

    const answer216 = {
      text: '788н',
      question: question16,
      isCorrect: true
    }

    const answer316 = {
      text: '1144н',
      question: question16,
      isCorrect: false
    }

    const question17 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Ветеринария»</b> \n\n Можно ли использовать «Поли-Спектр-8/В» в качестве ЭКГ монитора во время операций?',
      questionNumber: 17,
      quiz: quiz,
    }

    const answer117 = {
      text: 'Да',
      question: question17, 
      isCorrect: true
    }

    const answer217 = {
      text: 'Нет',
      question: question17,
      isCorrect: false
    }

    const question18 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Где используются ЭЭГ аппараты в ветеринарной практике?',
      questionNumber: 18,
      quiz: quiz,
    }

    const answer118 = {
      text: 'В ветеринарных кабинетах на приеме',
      question: question18, 
      isCorrect: false
    }

    const answer218 = {
      text: 'В крупных клиниках на приеме',
      question: question18,
      isCorrect: false
    }

    const answer318 = {
      text: 'В крупных клиниках в отделениях реанимации и интенсивной терапии',
      question: question18,
      isCorrect: true
    }

    const question19 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Где чаще всего используется электроретинограф?',
      questionNumber: 19,
      quiz: quiz,
    }

    const answer119 = {
      text: 'В клинической практике',
      question: question19, 
      isCorrect: false
    }

    const answer219 = {
      text: 'В науке',
      question: question19,
      isCorrect: true
    }

    const question20 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Что такое BAER-тест?',
      questionNumber: 20,
      quiz: quiz,
    }

    const answer120 = {
      text: 'Тест по выявлению нарушений слуха животного',
      question: question20, 
      isCorrect: true
    }

    const answer220 = {
      text: 'Тест на преодоление барьеров животным',
      question: question20,
      isCorrect: false
    }

    const answer320 = {
      text: 'Тест по выявлению нарушений в электрической активности мозга животного',
      question: question20,
      isCorrect: false
    }

    const question1_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «ИОМ»</b> \n\n Каково основное назначение системы для интраоперационного нейромониторинга?',
      questionNumber: 1,
      quiz: quiz2,
    }

    const answer11_q2 = {
      text: 'Предотвращение неврологического дефицита',
      question: question1_q2, 
      isCorrect: true
    }

    const answer21_q2 = {
      text: 'Мониторинг глубины анастезии',
      question: question1_q2,
      isCorrect: false
    }
    const answer31_q2 = {
      text: 'Мониторинг работы сердечно-сосудистой системы во время операции',
      question: question1_q2,
      isCorrect: false
    }
    const answer41_q2 = {
      text: 'Мониторинг жизненных показателей пациента во время операции',
      question: question1_q2,
      isCorrect: false
    }

    const question2_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'После приобретения оборудования, компания Нейрософт предлагает специалисту бесплатно обучиться работе на системе для интраоперационного нейромониторинга «Нейро-ИОМ»',
      questionNumber: 2,
      quiz: quiz2,
    }

    const answer12_q2 = {
      text: 'Проводятся теоретические и практические курсы по направлению «ИОМ во время нейрохирургических операций»',
      question: question2_q2, 
      isCorrect: false
    }

    const answer22_q2 = {
      text: 'Проводятся теоретические и практические курсы по направлению «ИОМ во время нейрохирургических операций»',
      question: question2_q2,
      isCorrect: false
    }
    const answer32_q2 = {
      text: 'Проводятся теоретические онлайн курсы и практические курсы по двум направлениям «ИОМ во время нейрохирургических операций», «ИОМ во время операций на щитовидной и паращитовидной железе и ЛОР операций»',
      question: question2_q2,
      isCorrect: true
    }

    const question3_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Выберите одно преимущество, которое НЕ может быть указано при демонстрации пользователю системы для интраоперационного мониторинга «Нейро-ИОМ»',
      questionNumber: 3,
      quiz: quiz2,
    }

    const answer13_q2 = {
      text: 'Мощный транскраниальный электрический стимулятор с различными типами стимула',
      question: question3_q2, 
      isCorrect: false
    }

    const answer23_q2 = {
      text: '3 канала электрического стимулятора',
      question: question3_q2,
      isCorrect: true
    }
    const answer33_q2 = {
      text: 'варианты исполнения для нейрофизиолога (мультимодальный мониторинг, гибкие настройки ПО) и нейрохирурга (несколько основных модальностей (TOF, DNS,спонтанная и вызванная ЭМГ), интуитивно понятный и простой нтерфейс, большой экран touchscreen)',
      question: question3_q2,
      isCorrect: false
    }
    const answer43_q2 = {
      text: 'предустановленные шаблоны для большинства операций для быстрого начала мониторинга',
      question: question3_q2,
      isCorrect: false
    }
    const answer53_q2 = {
      text: 'Программы стимуляции для автоматизации мониторинга',
      question: question3_q2,
      isCorrect: false
    }

    const question4_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «ЭЭГ»</b> \n\n Какой прибор из ЭЭГ-линейки может применяться для ЭЭГ, ПСГ, КВП, БОС, CFM и ЭМГ?',
      questionNumber: 4,
      quiz: quiz2,
    }

    const answer14_q2 = {
      text: 'Нейрон-Спектр-4',
      question: question4_q2, 
      isCorrect: false
    }

    const answer24_q2 = {
      text: 'Нейрон-Спектр-4/ВПМ',
      question: question4_q2,
      isCorrect: true
    }
    const answer34_q2 = {
      text: 'Нейрон-Спектр-СМ',
      question: question4_q2,
      isCorrect: false
    }
   
    const question5_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какой функциональной пробы НЕТ в списке общепринятых проб, проводимых при рутинном ЭЭГ-обследовании?',
      questionNumber: 5,
      quiz: quiz2,
    }

    const answer15_q2 = {
      text: 'Фотостимуляция',
      question: question5_q2, 
      isCorrect: false
    }

    const answer25_q2 = {
      text: 'Гиповентиляция',
      question: question5_q2,
      isCorrect: true
    }
    const answer35_q2 = {
      text: 'Фоностимуляция',
      question: question5_q2,
      isCorrect: false
    }
    const answer45_q2 = {
      text: 'Гипервентиляция',
      question: question5_q2,
      isCorrect: false
    }
    const answer55_q2 = {
      text: 'Фоновая запись',
      question: question5_q2,
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
        question8,
        question9,
        question10,
        question11,
        question12,
        question13,
        question14,
        question15,
        question16,
        question17,
        question18,
        question19,
        question20
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
        answer38,
        answer38,
        answer19,
        answer29,
        answer39,
        answer49,
        answer59,
        answer110,
        answer210,
        answer310,
        answer410,
        answer111,
        answer211,
        answer311,
        answer411,
        answer112,
        answer212,
        answer312,
        answer412,
        answer113,
        answer213,
        answer313,
        answer114,
        answer214,
        answer314,
        answer115,
        answer215,
        answer116,
        answer216,
        answer316,
        answer117,
        answer217,
        answer118,
        answer218,
        answer318,
        answer119,
        answer219,
        answer120,
        answer220,
        answer320
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
