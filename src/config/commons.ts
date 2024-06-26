import path from "path";

export const root: string = path.resolve(__dirname, "..")

export const MAIN_QUERY_ACTIONS = {
  SIGN_UP: 'sign_up',
  START_QUIZ: 'start_quiz'
}

export const USER_REG_STATUS = {
  FIO: 'fio',
  COMPANY: 'company',
  FINISH: 'finish'
} as const

export const QUESTION_STATUSES = {
  UNREAD: 'unread',
  ANSWERED: 'answered'
} as const

export const QUIZ_VARIANTS = {
  DAY_1: 'day1',
  DAY_2: 'day2',
  DAY_3: 'day3',
} as const

export const QUIZ_VARIANTS_ARR = Object.values(QUIZ_VARIANTS)

export const MAIN_USERS = {
  DANIL_COSTIN: 766776102, // ! telegramId
  ARTEM_CHURSIN: 958971126,
  ANASTASIA: 342105357
}

export const MAIN_USER_VAL = Object.values(MAIN_USERS)
