import TelegramBot from "node-telegram-bot-api";

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
