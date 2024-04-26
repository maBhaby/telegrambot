import TelegramBot, { Message } from "node-telegram-bot-api";
import { UserService } from "../services/user.service";

export class UserController {
  constructor (
    private readonly _app: TelegramBot, 
    private readonly userService: UserService
  ) {
    this._initRoutes()
  }

  private _initRoutes() {
    this._app.onText(/\/start/gi, this.start)
  }

  start = async (msg: Message) => {    
    await this.userService.start(msg)
  }
}

// export const userController = new UserController()
