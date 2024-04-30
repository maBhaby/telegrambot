import TelegramBot, {
  CallbackQuery,
  Message,
} from 'node-telegram-bot-api'
import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { menuForRegUser } from '../config/keyboards'
import { USER_REG_STATUS } from '../config/commons'

export class UserService {
  constructor(
    private readonly _app: TelegramBot,
    private readonly db: DataSource
  ) {}

  async start(msg: Message) {
    await this._app.sendMessage(
      msg.chat.id,
      'Привет дорогой друг! Нажми зарегаться чтоб принять участие в опросе',
      {
        reply_markup: {
          inline_keyboard: menuForRegUser,
        },
      }
    )
  }

  async create(query: CallbackQuery) {
    // console.log('query', query)
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

    this._app.sendMessage(chatId, 'Отлично, введите ФИО')
  }

  async getUser (telegramId: number) {
    const userRepository = this.db.getRepository(User)
    const users = await userRepository.findOneBy({telegramId})
    console.log('users', users);
    
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

    this._app.sendMessage(msg.chat.id, 'Отлично, теперь введите вашу компанию')
  }
}
