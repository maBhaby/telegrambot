import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
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
      try {
        if (msg.data === MAIN_QUERY_ACTIONS.START_QUIZ) {
          this.start(msg)
        }
      } catch (err) {
        console.log('Error :', err);
      }
    })

    this.app.on('message', ctx => {
      this.onAnswerQuestions(ctx)
    })
  }

  start = (msg: CallbackQuery) => {
    this.quizService.startQuiz(msg)
  }

  onAnswerQuestions = (msg: Message) => {
    this.quizService.onAnswerQuestions(msg)
  }
}
