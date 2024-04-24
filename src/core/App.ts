import TelegramBot from 'node-telegram-bot-api'
import { mainMenuWithAllCommand } from '../config/keyboards'
// import { getRouter } from '../routes'
import { UserController } from '../controllers'
import { UserService } from '../services/user.service'

export class App {
  private readonly _TOKEN: string

  private _app: TelegramBot

  constructor(token: string) {
    this._TOKEN = token
  }

  public getAppInstance() {
    return this._app
  }

  public initTelegramBot() {
    console.log('this._TOKEN', this._TOKEN);
    
    this._app = new TelegramBot(this._TOKEN, {
      polling: true,
    })

    this._setAllCommandToMenu()
    // this._provideControllers()
  }

  private _initRoutes() {
    // getRouter(this._app)
  }

  private _setAllCommandToMenu() {
    this._app.setMyCommands(mainMenuWithAllCommand)
  }

  private _provideControllers () {
    return {
      userController: new UserController(this._app, new UserService(this._app))
    }
  }
}
