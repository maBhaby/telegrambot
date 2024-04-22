import TelegramBot from 'node-telegram-bot-api'

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
    this._app = new TelegramBot(this._TOKEN, {
      polling: true,
    })

    this._initRoutes(this.getAppInstance())
  }

  private _initRoutes(app:TelegramBot) {
    
  }
}
