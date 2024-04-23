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
    console.log('this._TOKEN', this._TOKEN);
    
    this._app = new TelegramBot(this._TOKEN, {
      polling: true,
    })

    this._setAllCommandToMenu()
    this._initRoutes(this.getAppInstance())
  }

  private _initRoutes(app: TelegramBot) {
  
  }

  private _setAllCommandToMenu() {
    this._app.setMyCommands([
      {
        command: 'start',
        description: 'Запуск бота',
      },
      {
        command: 'ref',
        description: 'Получить реферальную ссылку',
      },
      {
        command: 'help',
        description: 'Раздел помощи',
      },
    ])
  }
}
