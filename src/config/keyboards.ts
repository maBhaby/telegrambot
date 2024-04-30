import TelegramBot from "node-telegram-bot-api";
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
