import TelegramBot from 'node-telegram-bot-api'
import { MESSAGES_QUIZ_DAY_ONE } from './config/messages'

const bot = new TelegramBot(process.env.TG_TOKEN as string, { polling: true })

// bot.on('text', async (msg) => {
//   const msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`)

//   setTimeout(async () => {
//     await bot.editMessageText(msg.text as string, {
//       chat_id: msgWait.chat.id,
//       message_id: msgWait.message_id
//     })
//   }, 5000)
// })

const userMap = new Map()

bot.onText(/\/start/, async (msg) => {
  try {
    await bot.sendMessage(
      msg.chat.id,
      'Добрый день! Чтобы участвовать в викторинах по итогам лекционных дней, вам необходимо пройти регистрацию.'
    )
  } catch (err) {
    console.log('error on start', err)
    await bot.sendMessage(msg.chat.id, 'Ой, что то пошло не так...')
  }
})

bot.onText(/\/menu/, async (msg) => {
  await bot.sendMessage(msg.chat.id, 'menu bot', {
    reply_markup: {
      keyboard: [[{ text: 'ya' }]],
      resize_keyboard: true
    }
  })
})

bot.onText(/Зарегистрироваться/, async (msg) => {
  if (userMap.has(msg.from?.id)) {
    await bot.sendMessage(msg.chat.id, 'Вы уже зарегистрированы!')
    return 
  }

  userMap.set(msg.from?.id, {
    event: 'fio',
    fio: '',
    company: '',
    quiz: '',
    quizStatus: ''
  })
  await bot.sendMessage(msg.chat.id, 'Введите ваше ФИО (Пример: Иванов Иван Иванович)')
})

bot.on('message', async (msg) => {
  if (userMap.has(msg.from?.id) && userMap.get(msg.from?.id).quiz === '') {
    const findedUser = userMap.get(msg.from?.id)
    if (findedUser.event === 'fio') {
      // тут ввели фио
      findedUser.fio = msg.text
      findedUser.event = 'company'
      await bot.sendMessage(msg.chat.id, 'Введите название вашей компании (Пример: Нейрософт)')

      return 
    } else if (findedUser.event === 'company') {
      findedUser.company = msg.text
      findedUser.event = 'finish'
      await bot.sendMessage(msg.chat.id, 'Регистраиця пройдена! К началу викторины мы пришлём вам уведомление!')
      console.log(userMap);
      return
    } else if (findedUser.event === 'finish') {
      /**
       * @description скорее всего удалить это надо
       */
      // await bot.sendMessage(msg.chat.id, 'Бро ты уже зареган')
      console.log(userMap);
      return
    }
  }

  if (userMap.has(msg.from?.id) && userMap.get(msg.from?.id).quiz !== '' && userMap.get(msg.from?.id).quizStatus === 'started') {
    console.log('msg after answer on test', msg);
  }
})

bot.onText(/\/Пройти тест/, async (msg) => {
  if (userMap.has(msg.from?.id) && userMap.get(msg.from?.id).event === 'finish') {
    const findedUser = userMap.get(msg.from?.id)

    findedUser.quiz = 'day 1'
    findedUser.quizStatus = 'started'

    await bot.sendMessage(msg.chat.id, MESSAGES_QUIZ_DAY_ONE.QUIZ_1.question, {
      reply_markup: {
        keyboard: [
          [{text: MESSAGES_QUIZ_DAY_ONE.QUIZ_1.answers.first.text}],
          [{text: MESSAGES_QUIZ_DAY_ONE.QUIZ_1.answers.second.text}],
          [{text: MESSAGES_QUIZ_DAY_ONE.QUIZ_1.answers.third.text}],
          [{text: MESSAGES_QUIZ_DAY_ONE.QUIZ_1.answers.fourth.text}]
        ]
      }
    })

    // findedUser.quizStatus = 'finished'

    // await bot.sendMessage(msg.chat.id, 'Спасибо что прошли тест. Следующий откроется завтра')
    // await bot.sendMessage(msg.chat.id, `Результаты попозже`)

    console.log('Пошла возняя');
    
  } else {
    await bot.sendMessage(msg.chat.id, 'Тебе пока нельзя')
  }
})

bot.on('polling_error', (err) => console.log(err.message)) 
