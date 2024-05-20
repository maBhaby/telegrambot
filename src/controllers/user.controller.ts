import TelegramBot, {
  CallbackQuery,
  Message,
} from 'node-telegram-bot-api'
import { UserService } from '../services/user.service'
import {
  MAIN_QUERY_ACTIONS,
  MAIN_USERS,
  USER_REG_STATUS,
  MAIN_USER_VAL
} from '../config/commons'

export class UserController {
  constructor(
    private readonly _app: TelegramBot,
    private readonly userService: UserService
  ) {
    this._initRoutes()
  }

  private _initRoutes() {
    this._app.onText(/\/start/gi, this.start)

    this._app.on('callback_query', (query) => {
      try {
        switch (query.data) {
          case MAIN_QUERY_ACTIONS.SIGN_UP:
            this.create(query)
            break
        }
      } catch (error) {
        console.warn('Error :', error)
      }
    })

    this._app.on('text', async (msg) => {
      const finedUser = await this.userService.getUser(
        msg.from?.id as number
      )
      if (!finedUser) return

      if (
        finedUser.registrationStatus === USER_REG_STATUS.FIO
      ) {
        this.updateUserFullName(msg)
      } else if (
        finedUser.registrationStatus ===
        USER_REG_STATUS.COMPANY
      ) {
        this.updateUserCompany(msg)
      }

      if (
        MAIN_USER_VAL.includes(finedUser.telegramId) && 
        msg.text === 'results'
      ) {
        this.getAllUserWithAnswers(msg)
      }
    })
  }

  start = async (msg: Message) => {
    await this.userService.start(msg)
  }

  create = (query: CallbackQuery) => {
    this.userService.create(query)
  }

  updateUserFullName = (msg: Message) => {
    this.userService.updateUserFullName(msg)
  }

  updateUserCompany = (msg: Message) => {
    this.userService.updateUserCompany(msg)
  }

  getAllUserWithAnswers = (msg: Message) => {
    this.userService.getAllUserWithAnswers(msg)
  }
}
