import TelegramBot from 'node-telegram-bot-api'
import { DataSource } from 'typeorm'

import { mainMenuWithAllCommand } from '../config/keyboards'
// import { getRouter } from '../routes'
import { UserController } from '../controllers'
import { UserService } from '../services/user.service'
import { root } from '../config/commons'
import { resolve } from 'path'

export class App {
  private readonly _TOKEN: string

  private _app: TelegramBot

  private db: DataSource

  constructor(token: string) {
    this._TOKEN = token
  }

  public getAppInstance() {
    return this._app
  }

  public async initTelegramBot() {
    console.log('this._TOKEN', this._TOKEN)

    this._app = new TelegramBot(this._TOKEN, {
      polling: true
    })

    // this._setAllCommandToMenu()
    await this._connectToDataBase()
    this._provideControllers()
  }

  private _setAllCommandToMenu() {
    this._app.setMyCommands(mainMenuWithAllCommand)
  }

  private async _connectToDataBase() {
    const appDataSource = new DataSource({
      type: 'sqlite',
      database: `${root}/database/db.sqlite`,
      migrationsRun: true,
      entities: [resolve(__dirname, "../", "entities", "*.entity.[t|j]s")],
      migrations: [resolve(__dirname, "../", "database", "migrations", "*.[t|j]s")],
      logging: true
    })

    this.db = await appDataSource.initialize()
  }

  private _provideControllers() {
    return {
      userController: new UserController(this._app, new UserService(this._app))
    }
  }
}
