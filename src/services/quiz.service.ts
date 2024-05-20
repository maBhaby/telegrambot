import TelegramBot, {
  CallbackQuery,
  KeyboardButton,
  Message
} from 'node-telegram-bot-api'
import { DataSource, FindOptionsRelations } from 'typeorm'
import { quizKeyboard } from '../config/keyboards'
import { Quiz } from '../entities/quiz.entity'
import { UserQuizStatus } from '../entities/user-quiz-status.entity'
import { User } from '../entities/user.entity'
import { Question } from '../entities/question.entity'
import { QuestionAnswer } from '../entities/question-answer.entity'
import { UserQuestionStatus } from '../entities/user-question-status.entity'

const userQuestionLock: Record<number, number> = {}

export class QuizService {
  constructor(private readonly app: TelegramBot, private readonly db: DataSource) {}

  async startQuiz(msg: CallbackQuery) {
    const userRep = this.db.getRepository(User)
    const user = await userRep.findOneBy({
      telegramId: msg.from.id
    })

    if (!user || user.registrationStatus !== 'finish') {
      return
    }

    const quizRep = this.db.getRepository(Quiz)
    const userQuizRep = this.db.getRepository(UserQuizStatus)
    const UserQuestionStatusRep = this.db.getRepository(UserQuestionStatus)
    const questionRep = this.db.getRepository(Question)

    const activeQuiz = await quizRep.findOne({
      where: {
        status: 'active'
      }
    })

    if (!activeQuiz) {
      await this.app.sendMessage(msg.from.id, 'Нет активных квизов')

      return
    }

    let currentUserQuiz = await userQuizRep.findOne({
      where: {
        quizId: activeQuiz.id,
        userId: user.id
      }
    })

    if (!currentUserQuiz) {
      currentUserQuiz = await userQuizRep.save({
        quizId: activeQuiz.id,
        userId: user.id,
        status: 'active',
        isActiveQuiz: true,
        currentQuestionNumber: 1
      })
      console.log('ret', currentUserQuiz)
    } else if (currentUserQuiz.status === 'finish') {
      /**
       * ! обновлять статус квиза
       */
      this.app.sendMessage(msg.from.id, 'Вы уже прошли этот квиз')

      return
    }

    const question = await questionRep.findOne({
      relations: {
        questionAnswer: true
      },
      where: {
        quiz: activeQuiz,
        questionNumber: 1
      }
    })

    if (question === null) return

    await UserQuestionStatusRep.save({
      userId: user.id,
      questionId: question.id,
      status: 'active'
    })

    const answersKeyboard = question.questionAnswer.map<KeyboardButton[]>((el) => [
      { text: el.text }
    ])

    this.app.sendMessage(msg.from.id, question.question, {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: answersKeyboard
      }
    })
  }

  onAnswerQuestions = async (msg: Message) => {
    if (!msg.from) return

    const userRep = this.db.getRepository(User)
    const user = await userRep.findOneBy({
      telegramId: msg.from.id
    })

    if (!user || user.registrationStatus !== 'finish') {
      return
    }

    const quizRep = this.db.getRepository(Quiz)
    const activeQuiz = await quizRep.findOne({
      where: {
        status: 'active'
      }
    })
    // console.log('active quiz', activeQuiz)

    if (!activeQuiz) {
      await this.app.sendMessage(msg.from.id, 'Нет активных квизов')

      return
    }

    const userQuizRep = this.db.getRepository(UserQuizStatus)
    const currentUserQuiz = await userQuizRep.findOne({
      where: {
        quizId: activeQuiz.id,
        userId: user.id
      }
    })

    if (!currentUserQuiz || currentUserQuiz.status === 'finish') {
      console.log(
        'Мы не смогли найти активный квиз пользователя или он уже прошел этот квиз'
      )

      return
    }

    const questionAnswerRep = this.db.getRepository(QuestionAnswer)
    const UserQuestionStatusRep = this.db.getRepository(UserQuestionStatus)
    const questionRep = this.db.getRepository(Question)
    // ! Прокинуть id юзера
    const userQuestStatus = await UserQuestionStatusRep.findOne({
      relations: {
        question: true
      },
      where: {
        userId: user.id,
        status: 'active',
        question: {
          questionNumber: currentUserQuiz.currentQuestionNumber
        }
      }
    })

    if (!userQuestStatus) {
      console.log('Не найден активный вопрос')
      return
    }
    // console.log('CURRENT USER and QUESTION', user, msg);

    // Синхронно проверяем lock
    if (userQuestStatus.userId in userQuestionLock) {
      console.log('Уже есть вопрос в обработке для этого пользователя')
      return
    }

    userQuestionLock[userQuestStatus.userId] = userQuestStatus.questionId

    try {
      const answer = await questionAnswerRep.findOne({
        where: {
          question: userQuestStatus.question,
          text: msg.text
        }
      })

      // console.log('ЕГО ответ', user, answer);

      if (!answer) {
        // console.log('Не найден Ответ на вопрос в базе')
        await this.app.sendMessage(
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
          userId: user.id,
          questionId: userQuestStatus.questionId
        },
        {
          isCorrectAnswer: answer.isCorrect,
          status: 'answered'
        }
      )

      const question = await questionRep.findOne({
        relations: {
          questionAnswer: true
        },
        where: {
          quiz: activeQuiz,
          questionNumber: currentUserQuiz.currentQuestionNumber + 1
        }
      })

      if (question === null) {
        await userQuizRep.update(
          {
            userId: currentUserQuiz.userId,
            quizId: currentUserQuiz.quizId
          },
          {
            status: 'finish'
          }
        )
        /**
         * @desc
         * Неправильная выборка (берет вообще все ответы)
         */
        const [, correctAnswerCount] = await UserQuestionStatusRep.findAndCountBy({
          isCorrectAnswer: true,
          userId: user.id
        })

        await this.app.sendMessage(
          msg.from.id,
          `Викторина завершена. На данный момент, ваш итоговый результат — ${correctAnswerCount} баллов`,
          { reply_markup: { remove_keyboard: true } }
        )
        return
      }

      await userQuizRep.update(
        {
          quizId: currentUserQuiz.quizId,
          userId: currentUserQuiz.userId
        },
        {
          currentQuestionNumber: currentUserQuiz.currentQuestionNumber + 1
        }
      )

      await UserQuestionStatusRep.save({
        userId: user.id,
        questionId: question.id,
        status: 'active'
      })

      const answersKeyboard = question.questionAnswer.map<KeyboardButton[]>((el) => [
        { text: el.text }
      ])

      await this.app.sendMessage(msg.from.id, question.question, {
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: answersKeyboard
        }
      })
    } finally {
      delete userQuestionLock[userQuestStatus.userId]
    }

    // console.log('userQuestStatus', userQuestStatus)
  }
}
