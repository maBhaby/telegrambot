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
      status: 'initial',
      // startDate: createDate(2024, 4, 16),
      startDate: '2024-05-16 16:50:00'
    }

    const quiz2 = {
        isActiveQuiz: false,
        quizName: QUIZ_VARIANTS.DAY_2,
        // startDate: createDate(2024, 4, 16)
        startDate: '2024-05-16 16:55:00',
        status: 'initial'
      }

    const quiz3 = {
        isActiveQuiz: false,
        quizName: QUIZ_VARIANTS.DAY_3,
        startDate: '2024-05-16 17:00:00',
        status: 'initial'
        // startDate: createDate(2024, 4, 16)
      }

    await this.db
      .getRepository(Quiz)
      .createQueryBuilder('quiz')
      .insert()
      .values([
        quiz,
        quiz2,
        quiz3,
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

    const question6_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Врач какой специальности занимается расшифровкой результатов ЭЭГ-обследований?',
      questionNumber: 6,
      quiz: quiz2,
    }

    const answer16_q2 = {
      text: 'Невролог',
      question: question6_q2, 
      isCorrect: false
    }

    const answer26_q2 = {
      text: 'Психиатр',
      question: question6_q2,
      isCorrect: false
    }
    const answer36_q2 = {
      text: 'Врач функциональной диагностики',
      question: question6_q2,
      isCorrect: true
    }

    const question7_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Врач какой специальности занимается расшифровкой результатов ЭЭГ-обследований?',
      questionNumber: 7,
      quiz: quiz2,
    }

    const answer17_q2 = {
      text: 'Невролог',
      question: question7_q2, 
      isCorrect: true
    }

    const answer27_q2 = {
      text: 'Психиатр',
      question: question7_q2,
      isCorrect: false
    }
    const answer37_q2 = {
      text: 'Врач функциональной диагностики',
      question: question7_q2,
      isCorrect: false
    }

    const answer47_q2 = {
      text: 'Врач функциональной диагностики',
      question: question7_q2,
      isCorrect: false
    }

    const question8_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Урология»</b> \n\n Что такое урофлоуметрия?',
      questionNumber: 8,
      quiz: quiz2,
    }

    const answer18_q2 = {
      text: 'Первый неинвазивный этап диагностики нарушений мочеиспускания у мужчин и у женщин',
      question: question8_q2, 
      isCorrect: true
    }

    const answer28_q2 = {
      text: 'Первый субъективный этап диагностики нарушений мочеиспускания у мужчин и у женщин',
      question: question8_q2,
      isCorrect: false
    }
    const answer38_q2 = {
      text: 'Первый неинвазивный этап диагностики нарушений слуха при непроизвольном мочеиспускании у мужчин и у женщин',
      question: question8_q2,
      isCorrect: false
    }
    const answer48_q2 = {
      text: 'Лечение нарушений мочеиспускания у мужчин и у женщин',
      question: question8_q2,
      isCorrect: false
    }

    const question9_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Основные исследуемые параметры при урофлоуметрии',
      questionNumber: 9,
      quiz: quiz2,
    }

    const answer19_q2 = {
      text: 'Скорость, выделенный объем, продолжительность мочеиспускания',
      question: question9_q2, 
      isCorrect: true
    }

    const answer29_q2 = {
      text: 'Выделенный объем, цвет, плотность мочи',
      question: question9_q2,
      isCorrect: false
    }
    const answer39_q2 = {
      text: 'Время мочеиспускания',
      question: question9_q2,
      isCorrect: false
    }

    const question10_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Ключевые пользователи-клиники:',
      questionNumber: 10,
      quiz: quiz2,
    }

    const answer110_q2 = {
      text: 'Отделение урологии, онкоурологии',
      question: question10_q2, 
      isCorrect: false
    }

    const answer210_q2 = {
      text: 'Центр реабилитации',
      question: question10_q2,
      isCorrect: false
    }
    const answer310_q2 = {
      text: 'Противотуберкулезный диспансер',
      question: question10_q2,
      isCorrect: false
    }
    const answer410_q2 = {
      text: 'Детское уроандрологическое отделение',
      question: question10_q2,
      isCorrect: false
    }
    const answer510_q2 = {
      text: 'Все вышеперечисленное',
      question: question10_q2,
      isCorrect: true
    }
    const answer610_q2 = {
      text: 'Ничего из вышеперечисленного',
      question: question10_q2,
      isCorrect: false
    }

    const question11_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Основное преимущество для потенциальных пользователей при покупке Амнис:',
      questionNumber: 11,
      quiz: quiz2,
    }

    const answer111_q2 = {
      text: 'Известный производитель, качественный продукт',
      question: question11_q2, 
      isCorrect: false
    }

    const answer211_q2 = {
      text: 'Быстрые поставки, качественное послепродажное обслуживание',
      question: question11_q2,
      isCorrect: false
    }
    const answer311_q2 = {
      text: 'Обучение нейроурологии на базе СПБГУ для 1 врача',
      question: question11_q2,
      isCorrect: true
    }

    const question12_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «ПСГ»</b> \n\n «Золотым стандартом» диагностики нарушений сна является:',
      questionNumber: 12,
      quiz: quiz2,
    }

    const answer112_q2 = {
      text: 'Полисомнография',
      question: question12_q2, 
      isCorrect: true
    }

    const answer212_q2 = {
      text: 'Кардиореспираторный монторинг',
      question: question12_q2,
      isCorrect: false
    }
    const answer312_q2 = {
      text: 'Респираторная полиграфия',
      question: question12_q2,
      isCorrect: false
    }
    const answer412_q2 = {
      text: 'Компьютерная пульсоксиметрия',
      question: question12_q2,
      isCorrect: false
    }
    const answer512_q2 = {
      text: 'Все вышеперечисленное',
      question: question12_q2,
      isCorrect: false
    }
    const answer612_q2 = {
      text: 'Ничего из вышеперечисленного',
      question: question12_q2,
      isCorrect: false
    }

    const question13_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Выберите параметры, которые регистрирует Снорлекс',
      questionNumber: 13,
      quiz: quiz2,
    }

    const answer113_q2 = {
      text: 'Храп, положение тела, электроэнцефалограмма (ЭЭГ)',
      question: question13_q2, 
      isCorrect: false
    }
    const answer213_q2 = {
      text: 'Сатурация (SpO2), положение тела, артериальное давление (АД), дыхательные усилия',
      question: question13_q2,
      isCorrect: false
    }
    const answer313_q2 = {
      text: 'Храп, сатурация (SpO2), положение тела, электроэнцефалограмма (ЭЭГ)',
      question: question13_q2,
      isCorrect: false
    }
    const answer413_q2 = {
      text: 'Храп, сатурация (SpO2), положение тела, дыхательные усилия',
      question: question13_q2,
      isCorrect: true
    }

    const question14_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Респираторный полиграф Снорлекс по классификации РОС соответствует типам приборов',
      questionNumber: 14,
      quiz: quiz2,
    }

    const answer114_q2 = {
      text: 'I и II',
      question: question14_q2, 
      isCorrect: false
    }
    const answer214_q2 = {
      text: 'II',
      question: question14_q2,
      isCorrect: false
    }
    const answer314_q2 = {
      text: 'II и III',
      question: question14_q2,
      isCorrect: false
    }
    const answer414_q2 = {
      text: 'III',
      question: question14_q2,
      isCorrect: false
    }
    const answer514_q2 = {
      text: 'III и IV',
      question: question14_q2,
      isCorrect: true
    }
    const answer614_q2 = {
      text: 'IV',
      question: question14_q2,
      isCorrect: false
    }

    const question15_q2 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Выберите утверждение, которое НЕ может быть причиной, почему выгодно продавать полисомнографы Нейрософт',
      questionNumber: 15,
      quiz: quiz2,
    }

    const answer115_q2 = {
      text: 'ПСГ – это дополнение к электроэнцефалографу, если он уже есть у клиента.',
      question: question15_q2, 
      isCorrect: false
    }
    const answer215_q2 = {
      text: 'ПСГ - это возможность занять свободную нишу на рынке медицинских услуг',
      question: question15_q2,
      isCorrect: false
    }
    const answer315_q2 = {
      text: 'ПСГ можно продавать по схеме лизинга',
      question: question15_q2,
      isCorrect: false
    }
    const answer415_q2 = {
      text: 'ПСГ обязательна для всех людей с нарушениями сна',
      question: question15_q2,
      isCorrect: true
    }

    const question1_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «ЭКГ»</b> \n\n Что не является основным недостатком у электрокардиографов со встроенным термопринтером?',
      questionNumber: 1,
      quiz: quiz3,
    }

    const answer11_q3 = {
      text: 'Кабель пациента со стандартным разъемом',
      question: question1_q3, 
      isCorrect: true
    }

    const answer21_q3 = {
      text: 'Не имеют интеграции в медицинские информационные системы',
      question: question1_q3,
      isCorrect: false
    }
    const answer31_q3 = {
      text: 'Чаще всего не имеют автоматического измерения и анализа ЭКГ',
      question: question1_q3,
      isCorrect: false
    }

    const question2_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '«Эргопойнт» - система для нагрузочного тестирования может поставляться к имеющемуся у больницы нагрузочному устройству?',
      questionNumber: 2,
      quiz: quiz3,
    }

    const answer12_q3 = {
      text: 'Да',
      question: question2_q3, 
      isCorrect: true
    }

    const answer22_q3 = {
      text: 'Нет',
      question: question2_q3,
      isCorrect: false
    }

    const question3_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какое оборудование НЕ может быть использовано для кардиоинтервалографии? ',
      questionNumber: 3,
      quiz: quiz3,
    }

    const answer13_q3 = {
      text: '«ВНС-Микро»',
      question: question3_q3, 
      isCorrect: false
    }

    const answer23_q3 = {
      text: 'Ergostik',
      question: question3_q3,
      isCorrect: true
    }
    const answer33_q3 = {
      text: 'Любой электрокардиограф производства Нейрософт с программой «Поли-Спектр.NET/Ритм»',
      question: question3_q3,
      isCorrect: false
    }

    const question4_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какое оборудование нужно для оценки эластических свойств сосудов?',
      questionNumber: 4,
      quiz: quiz3,
    }

    const answer14_q3 = {
      text: '«ВНС-Микро»',
      question: question4_q3, 
      isCorrect: false
    }

    const answer24_q3 = {
      text: 'Ergostik',
      question: question4_q3,
      isCorrect: false
    }
    const answer34_q3 = {
      text: 'Любой электрокардиограф производства Нейрософт с программой «Поли-Спектр.NET/Ритм»',
      question: question4_q3,
      isCorrect: false
    }
    const answer44_q3 = {
      text: 'Любой электрокардиограф производства Нейрософт с программой «Поли-Спектр.NET/СРПВ»',
      question: question4_q3,
      isCorrect: true
    }

    const question5_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «ЭМГ/ВП/ЭРГ»</b> \n\n Что исследует ЭМГ?',
      questionNumber: 5,
      quiz: quiz3,
    }

    const answer15_q3 = {
      text: 'Опорно-двигательный аппарат',
      question: question5_q3, 
      isCorrect: false
    }

    const answer25_q3 = {
      text: 'Нервно-мышечную систему',
      question: question5_q3,
      isCorrect: true
    }
    const answer35_q3 = {
      text: 'Центральную нервную систему',
      question: question5_q3,
      isCorrect: false
    }
    const answer45_q3 = {
      text: 'Зрительную систему',
      question: question5_q3,
      isCorrect: false
    }

    const question6_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Вызванных потенциалов какой модальности не существует?',
      questionNumber: 6,
      quiz: quiz3,
    }

    const answer16_q3 = {
      text: 'Соматосенсорные',
      question: question6_q3, 
      isCorrect: false
    }

    const answer26_q3 = {
      text: 'Слуховые',
      question: question6_q3,
      isCorrect: false
    }
    const answer36_q3 = {
      text: 'Зрительные',
      question: question6_q3,
      isCorrect: false
    }
    const answer46_q3 = {
      text: 'Сосудистые',
      question: question6_q3,
      isCorrect: true
    }

    const question7_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Вызванных потенциалов какой модальности не существует?',
      questionNumber: 7,
      quiz: quiz3,
    }

    const answer17_q3 = {
      text: 'Cостояние сетчатки',
      question: question7_q3, 
      isCorrect: true
    }

    const answer27_q3 = {
      text: 'Cостояние зрительной коры',
      question: question7_q3,
      isCorrect: false
    }
    const answer37_q3 = {
      text: 'Cостояние зрительного нерва',
      question: question7_q3,
      isCorrect: false
    }
    const answer47_q3 = {
      text: 'Cостояние роговицы',
      question: question7_q3,
      isCorrect: false
    }

    const question8_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'С каким миографом можно использовать ТМС?',
      questionNumber: 8,
      quiz: quiz3,
    }

    const answer18_q3 = {
      text: 'Лайтбокс',
      question: question8_q3, 
      isCorrect: false
    }

    const answer28_q3 = {
      text: 'Скайбокс',
      question: question8_q3,
      isCorrect: false
    }
    const answer38_q3 = {
      text: 'Нейро-МВП-4/8',
      question: question8_q3,
      isCorrect: false
    }
    const answer48_q3 = {
      text: 'Cо всеми перечисленными вариантами',
      question: question8_q3,
      isCorrect: true
    }

    const question9_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Аудиология»</b> \n\n Какой прибор НЕ подходит для оснащения оториноларингологического кабинета? ',
      questionNumber: 9,
      quiz: quiz3,
    }

    const answer19_q3 = {
      text: 'Нейро-Аудио',
      question: question9_q3, 
      isCorrect: true
    }

    const answer29_q3 = {
      text: 'Аудио-СМАРТ',
      question: question9_q3,
      isCorrect: false
    }
    const answer39_q3 = {
      text: 'аСкрин',
      question: question9_q3,
      isCorrect: false
    }
    const answer49_q3 = {
      text: 'аТимп',
      question: question9_q3,
      isCorrect: false
    }

    const question10_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какой импенадсометрической методики нет в приборе "Аудио-СМАРТ"?',
      questionNumber: 10,
      quiz: quiz3,
    }

    const answer110_q3 = {
      text: 'Тимпанометрия',
      question: question10_q3, 
      isCorrect: false
    }

    const answer210_q3 = {
      text: 'АР',
      question: question10_q3,
      isCorrect: false
    }
    const answer310_q3 = {
      text: 'Распад АР',
      question: question10_q3,
      isCorrect: false
    }
    const answer410_q3 = {
      text: 'ФСТ',
      question: question10_q3,
      isCorrect: false
    }
    const answer510_q3 = {
      text: 'ФСТ-2',
      question: question10_q3, 
      isCorrect: true
    }

    const question11_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'В каком отделе органа слуха волосковые клетки преобразуют колебания в электрические нервные импульсы?',
      questionNumber: 11,
      quiz: quiz3,
    }

    const answer111_q3 = {
      text: 'Наружное ухо',
      question: question11_q3, 
      isCorrect: false
    }

    const answer211_q3 = {
      text: 'Среднее ухо',
      question: question11_q3,
      isCorrect: false
    }
    const answer311_q3 = {
      text: 'Внутреннее ухо',
      question: question11_q3,
      isCorrect: true
    }
    const answer411_q3 = {
      text: 'Слуховой нерв',
      question: question11_q3,
      isCorrect: false
    }

    const question12_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Какие аудиологические приборы можно предлагать к продаже в отделения для больных с ОНМК (острыми нарушениями мозгового кровообращения)?',
      questionNumber: 12,
      quiz: quiz3,
    }

    const answer112_q3 = {
      text: 'Аудиометры, Приборы для регистрации отоакустической эмиссии',
      question: question12_q3, 
      isCorrect: false
    }

    const answer212_q3 = {
      text: 'Тимпанометры (импедансные аудиометры), Системы для регистрации слуховых ВП',
      question: question12_q3,
      isCorrect: false
    }
    const answer312_q3 = {
      text: 'Приборы для регистрации отоакустической эмиссии, Системы для регистрации слуховых ВП',
      question: question12_q3,
      isCorrect: true
    }
    const answer412_q3 = {
      text: 'Камертоны, Аудиометры, Приборы для регистрации отоакустической эмиссии',
      question: question12_q3,
      isCorrect: false
    }

    const question13_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: '<b>Секция «Спирометрия»</b> \n\n Какое место занимает ХОБЛ (хроническая обструктивная болезнь легких) в структуре смертности в мире?',
      questionNumber: 13,
      quiz: quiz3,
    }

    const answer113_q3 = {
      text: '1',
      question: question13_q3, 
      isCorrect: false
    }

    const answer213_q3 = {
      text: '2',
      question: question13_q3,
      isCorrect: false
    }
    const answer313_q3 = {
      text: '3',
      question: question13_q3,
      isCorrect: true
    }
    const answer413_q3 = {
      text: '4',
      question: question13_q3,
      isCorrect: false
    }
    const answer513_q3 = {
      text: 'Никакое',
      question: question13_q3,
      isCorrect: false
    }

    const question14_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Спирометрию НЕ используют для:',
      questionNumber: 14,
      quiz: quiz3,
    }

    const answer114_q3 = {
      text: 'Диагностики вентиляционных нарушений легких',
      question: question14_q3, 
      isCorrect: false
    }

    const answer214_q3 = {
      text: 'Динамического наблюдения пациентов с ранее выявленными вентиляционными нарушениями легких',
      question: question14_q3,
      isCorrect: false
    }
    const answer314_q3 = {
      text: 'Диагностики острых респираторных заболеваний',
      question: question14_q3,
      isCorrect: true
    }
    const answer414_q3 = {
      text: 'Профилактических осмотров работников вредных производств',
      question: question14_q3,
      isCorrect: false
    }

    const question15_q3 = {
      questionStatus: 'unread' as QuestionStatusTypes,
      question: 'Что из ниже перечисленного НЕ явялется преимуществом спирометра "Спиро-Спектр"?',
      questionNumber: 15,
      quiz: quiz3,
    }

    const answer115_q3 = {
      text: 'Контроль воспроизводимости и критериев качества',
      question: question15_q3, 
      isCorrect: false
    }

    const answer215_q3 = {
      text: 'Звуковые и текстовые подсказки, анимация для детей',
      question: question15_q3,
      isCorrect: false
    }
    const answer315_q3 = {
      text: 'Возможность редактировать карточку пациента и обследования',
      question: question15_q3,
      isCorrect: false
    }
    const answer415_q3 = {
      text: 'Не требуется ежедневная калибровка прибора',
      question: question15_q3,
      isCorrect: true
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
        question20,
        question1_q2,
        question2_q2,
        question3_q2,
        question4_q2,
        question5_q2,
        question6_q2,
        question7_q2,
        question8_q2,
        question9_q2,
        question10_q2,
        question11_q2,
        question12_q2,
        question13_q2,
        question14_q2,
        question15_q2,
        question1_q3,
        question2_q3,
        question3_q3,
        question4_q3,
        question5_q3,
        question6_q3,
        question7_q3,
        question8_q3,
        question9_q3,
        question10_q3,
        question11_q3,
        question12_q3,
        question13_q3,
        question14_q3,
        question15_q3

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
        answer320,
        answer11_q2,
        answer21_q2,
        answer31_q2,
        answer41_q2,
        answer12_q2,
        answer22_q2,
        answer32_q2,
        answer13_q2,
        answer23_q2,
        answer33_q2,
        answer43_q2,
        answer53_q2,
        answer14_q2,
        answer24_q2,
        answer34_q2,
        answer15_q2,
        answer25_q2,
        answer35_q2,
        answer45_q2,
        answer55_q2,
        answer16_q2,
        answer26_q2,
        answer36_q2,
        answer17_q2,
        answer27_q2,
        answer37_q2,
        answer47_q2,
        answer18_q2,
        answer28_q2,
        answer38_q2,
        answer48_q2,
        answer19_q2,
        answer29_q2,
        answer39_q2,
        answer110_q2,
        answer210_q2,
        answer310_q2,
        answer410_q2,
        answer510_q2,
        answer111_q2,
        answer211_q2,
        answer311_q2,
        answer112_q2,
        answer212_q2,
        answer312_q2,
        answer412_q2,
        answer512_q2,
        answer612_q2,
        answer113_q2,
        answer213_q2,
        answer313_q2,
        answer413_q2,
        answer114_q2,
        answer214_q2,
        answer314_q2,
        answer414_q2,
        answer514_q2,
        answer614_q2,
        answer115_q2,
        answer215_q2,
        answer315_q2,
        answer415_q2,
        answer11_q3,
        answer21_q3,
        answer31_q3,
        answer12_q3,
        answer22_q3,
        answer13_q3,
        answer23_q3,
        answer33_q3,
        answer14_q3,
        answer24_q3,
        answer34_q3,
        answer44_q3,
        answer15_q3,
        answer25_q3,
        answer35_q3,
        answer45_q3,
        answer16_q3,
        answer26_q3,
        answer36_q3,
        answer46_q3,
        answer17_q3,
        answer27_q3,
        answer37_q3,
        answer47_q3,
        answer18_q3,
        answer28_q3,
        answer38_q3,
        answer48_q3,
        answer19_q3,
        answer29_q3,
        answer39_q3,
        answer49_q3,
        answer110_q3,
        answer210_q3,
        answer310_q3,
        answer410_q3,
        answer510_q3,
        answer111_q3,
        answer211_q3,
        answer311_q3,
        answer411_q3,
        answer112_q3,
        answer212_q3,
        answer312_q3,
        answer412_q3,
        answer113_q3,
        answer213_q3,
        answer313_q3,
        answer413_q3,
        answer513_q3,
        answer114_q3,
        answer214_q3,
        answer314_q3,
        answer414_q3,
        answer115_q3,
        answer215_q3,
        answer315_q3,
        answer415_q3
        
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
