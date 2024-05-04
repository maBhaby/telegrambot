import path from "path";

export const root: string = path.resolve(__dirname, "..")

export const MAIN_QUERY_ACTIONS = {
  SIGN_UP: 'Sign_up'
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
