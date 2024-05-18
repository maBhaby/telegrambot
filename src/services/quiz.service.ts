import TelegramBot, {
  CallbackQuery,
  KeyboardButton,
  Message,
} from 'node-telegram-bot-api'
import { DataSource, FindOptionsRelations } from 'typeorm'
import { quizKeyboard } from '../config/keyboards'
import { Quiz } from '../entities/quiz.entity'
import { UserQuizStatus } from '../entities/user-quiz-status.entity'
import { User } from '../entities/user.entity'
import { Question } from '../entities/question.entity'
import { QuestionAnswer } from '../entities/question-answer.entity'
import { UserQuestionStatus } from '../entities/user-question-status.entity'

export class QuizService {
  constructor(
    private readonly app: TelegramBot,
    private readonly db: DataSource
  ) {}

  async startQuiz(msg: CallbackQuery) {
    const userRep = this.db.getRepository(User)
    const user = await userRep.findOneBy({
      telegramId: msg.from.id,
    })

    if (!user || user.registrationStatus !== 'finish') {
      return
    }

    const quizRep = this.db.getRepository(Quiz)
    const userQuizRep =
      this.db.getRepository(UserQuizStatus)
    const UserQuestionStatusRep = this.db.getRepository(
      UserQuestionStatus
    )
    const questionRep = this.db.getRepository(Question)

    const activeQuiz = await quizRep.findOne({
      where: {
        status: 'active',
      },
    })

    if (!activeQuiz) {
      await this.app.sendMessage(
        msg.from.id,
        'Нет активных квизов'
      )

      return
    }

    let currentUserQuiz = await userQuizRep.findOne({
      where: {
        quizId: activeQuiz.id,
        userId: user.id,
      },
    })

    if (!currentUserQuiz) {
      currentUserQuiz = await userQuizRep.save({
        quizId: activeQuiz.id,
        userId: user.id,
        status: 'active',
        isActiveQuiz: true,
        user,
        currentQuestionNumber: 1,
        quiz: activeQuiz,
      })
      console.log('ret', currentUserQuiz)
    } else if (currentUserQuiz.status === 'finish') {
      /**
       * ! обновлять статус квиза
       */
      this.app.sendMessage(
        msg.from.id,
        'Вы уже прошли этот квиз'
      )

      return
    }

    const question = await questionRep.findOne({
      relations: {
        questionAnswer: true,
      },
      where: {
        quiz: activeQuiz,
      },
    })

    if (question === null) return

    await UserQuestionStatusRep.save({
      userId: user.id,
      questionId: question.id,
      status: 'active',
      user,
      question,
    })

    const answersKeyboard = question.questionAnswer.map<
      KeyboardButton[]
    >((el) => [{ text: el.text }])

    this.app.sendMessage(msg.from.id, question.question, {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: answersKeyboard,
      },
    })
  }

  onAnswerQuestions = async (msg: Message) => {
    if (!msg.from) return

    const userRep = this.db.getRepository(User)
    const user = await userRep.findOneBy({
      telegramId: msg.from.id,
    })

    if (!user || user.registrationStatus !== 'finish') {
      return
    }

    const quizRep = this.db.getRepository(Quiz)
    const activeQuiz = await quizRep.findOne({
      where: {
        status: 'active',
      },
    })
    // console.log('active quiz', activeQuiz)

    if (!activeQuiz) {
      await this.app.sendMessage(
        msg.from.id,
        'Нет активных квизов'
      )

      return
    }

    const userQuizRep =
      this.db.getRepository(UserQuizStatus)
    const currentUserQuiz = await userQuizRep.findOne({
      where: {
        quizId: activeQuiz.id,
        userId: user.id,
      },
    })

    if (
      !currentUserQuiz ||
      currentUserQuiz.status === 'finish'
    ) {
      console.log(
        'Мы не смогли найти активный квиз пользователя или он уже прошел этот квиз'
      )

      return
    }

    const questionAnswerRep =
      this.db.getRepository(QuestionAnswer)
    const UserQuestionStatusRep = this.db.getRepository(
      UserQuestionStatus
    )
    const questionRep = this.db.getRepository(Question)

    const userQuestStatus =
      await UserQuestionStatusRep.findOne({
        relations: {
          question: true,
        },
        where: {
          userId: user.id,
          status: 'active',
        },
      })

    if (!userQuestStatus) {
      console.log('Не найден активный вопрос')
      return
    }
    console.log('CURRENT USER and QUESTION', user, msg);
    
    const answer = await questionAnswerRep.findOne({
      where: {
        question: userQuestStatus.question,
        text: msg.text,
      },
    })

    console.log('ЕГО ответ', user, answer);

    if (!answer) {
      // console.log('Не найден Ответ на вопрос в базе')
      this.app.sendMessage(
        msg.from.id,
        'Пожалуйста, отвечайте только с помощью клавиатуры'
      )

      return
    }
    /**
     * @status
     * * ответили на вопрос
     */
    await UserQuestionStatusRep.update(
      {
        userId: userQuestStatus.userId,
        questionId: userQuestStatus.questionId,
      },
      {
        isCorrectAnswer: answer.isCorrect,
        status: 'answered',
      }
    )

    const question = await questionRep.findOne({
      relations: {
        questionAnswer: true,
      },
      where: {
        quiz: activeQuiz,
        questionNumber:
          currentUserQuiz.currentQuestionNumber + 1,
      },
    })

    if (question === null) {
      userQuizRep.update(
        {
          userId: currentUserQuiz.userId,
          quizId: currentUserQuiz.quizId,
        },
        {
          status: 'finish',
        }
      )
      /**
       * @desc
       * Неправильная выборка (берет вообще все ответы)
       */
      const [,correctAnswerCount] = await UserQuestionStatusRep.findAndCountBy({
        isCorrectAnswer: true, userId: user.id, })
      
      this.app.sendMessage(
        msg.from.id,
        `Викторина завершена. На данный момент, ваш итоговый результат — ${correctAnswerCount} баллов`,
        { reply_markup: { remove_keyboard: true } }
      )
      return
    }

    userQuizRep.update(
      {
        quizId: currentUserQuiz.quizId,
        userId: currentUserQuiz.userId,
      },
      {
        currentQuestionNumber:
          currentUserQuiz.currentQuestionNumber + 1,
      }
    )

    await UserQuestionStatusRep.save({
      userId: user.id,
      questionId: question.id,
      status: 'active',
      user,
      question,
    })

    const answersKeyboard = question.questionAnswer.map<
      KeyboardButton[]
    >((el) => [{ text: el.text }])

    this.app.sendMessage(msg.from.id, question.question, {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: answersKeyboard,
      },
    })

    // console.log('userQuestStatus', userQuestStatus)
  }
}
