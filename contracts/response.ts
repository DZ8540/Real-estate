export type ResponseApiError = {
  status: number,
  message: string,
  code: ResponseCodes,
  body?: {
    [key: string]: any
  }
}

export enum ResponseCodes {
  SUCCESS = 'SUCCESS',

  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  MAILER_ERROR = 'MAILER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

export enum ResponseMessages {
  USER_UNBLOCKED = 'Пользователь был успешно разблокирован!',
  USER_ACTIVATED = 'Вы успешно активировали свой аккаунт!',
  USER_BLOCKED = 'Пользователь был успешно заблокирован!',
  USER_LOGIN = 'Вы успешно вошли в свой аккаунт!',
  USER_LOGOUT = 'Вы успешно вышли из своего аккаунта!',
  REGISTER_SUCCESS = 'Вы успешно зарегистрировались, заявка на подтверждение аккаунта была отправлена на вашу почту!',
  TOKEN_SUCCESS = 'Токен успешно обновлен!',

  ALREADY_ACTIVATED = 'Пользователь уже активировал свой аккаунт!',
  NOT_ADMIN = 'Вы не являетесь администратором!',
  NOT_REGISTERED = 'Пользователь не зарегистрирован',
  ERROR = 'Что-то пошло не так, повторите попытку еще раз!',
  VALIDATION_ERROR = 'Заполните пожалуйста все поля правильно!',
  USER_NOT_FOUND = 'Пользователь не найден!',
  ROLE_NOT_FOUND = 'Роль не найдена!',
  EMAIL_NOT_FOUND = 'Почта не найдена!',

  IP_NOT_FOUND = 'IP пользователя не установлен!',
  UA_NOT_FOUND = 'User-Agent пользователя не установлен!',
  FINGERPRINT_NOT_FOUND = 'Fingerprint пользователя не установлен!',
  TOKEN_EXPIRED = 'Ваша сессия истекла!'
}
