import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { QuizService } from "../services";
import { MAIN_QUERY_ACTIONS } from "../config/commons";

export class QuizController {
  constructor(
    private readonly app: TelegramBot, 
    private readonly quizService: QuizService
  ) {
    this._initRoutes()
  }

  private _initRoutes () {
    this.app.on('callback_query', async (msg) => {
      console.log("MSG", msg);
      
      try {
        if (msg.data === MAIN_QUERY_ACTIONS.START_QUIZ) {
          this.start(msg)
        }
      } catch (err) {
        console.log('Error :', err);
      }
    })
  }

  start = (msg: CallbackQuery) => {
    this.quizService.startQuiz(msg)
  }
}
