import TelegramBot, {
  CallbackQuery,
  Message,
} from 'node-telegram-bot-api'
import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { menuForRegUser } from '../config/keyboards'
import { USER_REG_STATUS } from '../config/commons'
import { UserQuestionStatus } from '../entities/user-question-status.entity'

export class UserService {
  constructor(
    private readonly _app: TelegramBot,
    private readonly db: DataSource
  ) {}

  async start(msg: Message) {
    await this._app.sendMessage(
      msg.chat.id,
      'Добрый день! Чтобы участвовать в викторинах по итогам лекционных дней, вам необходимо пройти регистрацию.',
      {
        reply_markup: {
          inline_keyboard: menuForRegUser,
        },
      }
    )
  }

  async create(query: CallbackQuery) {
    const telegramId = query.from.id
    const chatId = query.message?.chat.id as number

    const finedUser = await this.getUser(telegramId)

    if (finedUser) {
      this._app.sendMessage(chatId, 'вы уже есть в системе')
      return 
    }

    const user = new User({
      telegramId,
      chatId,
      fullName: '',
      company: '',
      registrationStatus: USER_REG_STATUS.FIO,
    })
    this.db.manager.save(user)

    this._app.sendMessage(chatId, 'Введите ваше ФИО (Пример: Иванов Иван Иванович)')
  }

  async getUser (telegramId: number) {
    const userRepository = this.db.getRepository(User)
    const users = await userRepository.findOneBy({telegramId})
    
    return users
  }

  async updateUserFullName(msg: Message) {
    const userRepository = this.db.getRepository(User)
    const telegramId = msg.from?.id as number
    const fullName = msg.text

    await userRepository.update({telegramId},{
      fullName: fullName,
      registrationStatus: USER_REG_STATUS.COMPANY
    })

    this._app.sendMessage(msg.chat.id, 'Введите название вашей компании (Пример: Нейрософт)')
  }

  async updateUserCompany(msg: Message) {
    const userRepository = this.db.getRepository(User)
    const telegramId = msg.from?.id as number
    const company = msg.text

    await userRepository.update({telegramId},{
      company: company,
      registrationStatus: USER_REG_STATUS.FINISH
    })

    this._app.sendMessage(msg.chat.id, 'Регистрация пройдена! К началу викторины мы пришлём вам уведомление!')
  }

  async getAllUserWithAnswers() {
    const userRepository = this.db.getRepository(User)
    const UserQuestionStatusRep = this.db.getRepository(
      UserQuestionStatus
    )

    const entityManager = this.db.createQueryRunner()
    const result = await entityManager.manager.query(`
      SELECT u.full_name, u.company, COUNT(u.user_id) as u_count
      FROM user as u
      
      JOIN user_question_status as qu 
      ON u.user_id  = qu.user_id
      
      JOIN question as q
      ON qu.question_id = q.question_id 
      
      JOIN user_quiz_status AS quizs
      ON u.user_id  = quizs.user_id and q.quiz_id = quizs.quiz_id
      
      WHERE quizs.quiz_status  = 'finish' AND qu.is_correct_answer = 1
      
      GROUP BY u.user_id 
      ORDER BY u_count DESC
    `)

    console.log('asdasd', result);
    

    // const allUserСompletedQuiz = await userRepository.find({
    //   relations: ['userQuizStatus', ''],
    //   where: {
    //     registrationStatus: 'finish',
    //     userQuizStatus: {
    //       status: 'finish'
    //     }
    //   }
    // })

    // if (!allUserСompletedQuiz) {
    //   console.log('Error: Не нашли юзеров с завершенными квизами');
    //   return
    // }

    // const [answers, count] = await UserQuestionStatusRep.findAndCount({
    //   where: {
    //     user: In(allUserСompletedQuiz),
    //     isCorrectAnswer: true
    //   }
    // })
    
    // if (!answers && !count) return

    // console.log('answers', answers);
    // console.log('count', count);

  }
}
