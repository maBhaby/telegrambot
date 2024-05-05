import TelegramBot, { KeyboardButton } from "node-telegram-bot-api";
import { MAIN_QUERY_ACTIONS } from "./commons";

export const mainMenuWithAllCommand: TelegramBot.BotCommand[] = [
  {
    command: 'start',
    description: 'Запуск бота',
  },
  {
    command: 'Take the test',
    description: 'Пройти тест',
  },
  {
    command: 'reg',
    description: 'Зарегестрироваться',
  },
]

export const menuForRegUser: TelegramBot.InlineKeyboardButton[][] = [
  [{text: 'Зарегестрироваться', callback_data: MAIN_QUERY_ACTIONS.SIGN_UP}],
]

export const menuForStartQuiz: TelegramBot.InlineKeyboardButton[][] = [
  [{text: 'Пройти тест', callback_data: MAIN_QUERY_ACTIONS.START_QUIZ}],
]

export const quizKeyboard: KeyboardButton[][] = [
  [{text:'Да'}], [{text:'Нет'}]
]
