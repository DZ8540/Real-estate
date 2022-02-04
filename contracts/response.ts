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

  NEWS_CREATED = 'Новость была успешно создана и опубликована!',
  NEWS_UPDATED = 'Новость была успешно обновлена!',
  NEWS_DELETED = 'Новость была успешно удалена!',

  REAL_ESTATE_TYPES_CREATED = 'Тип недвижимости был успешно создана и опубликован!',
  REAL_ESTATE_TYPES_UPDATED = 'Тип недвижимости был успешно обновлен!',
  REAL_ESTATE_TYPES_DELETED = 'Тип недвижимости был успешно удален!',

  ESTATE_CREATED = 'Объект был успешно создан и опубликован!',
  ESTATE_UPDATED = 'Объект был успешно обновлен!',
  ESTATE_DELETED = 'Объект был успешно удален!',

  NOT_REGISTERED = 'Пользователь не зарегистрирован',
  NOT_ADMIN = 'Вы не являетесь администратором!',
  ALREADY_ACTIVATED = 'Пользователь уже активировал свой аккаунт!',
  REGISTER_SUCCESS = 'Вы успешно зарегистрировались, заявка на подтверждение аккаунта была отправлена на вашу почту!',

  ERROR = 'Что-то пошло не так, повторите попытку еще раз!',
  VALIDATION_ERROR = 'Заполните пожалуйста все поля правильно!',

  USER_NOT_FOUND = 'Пользователь не найден!',
  ROLE_NOT_FOUND = 'Роль не найдена!',
  EMAIL_NOT_FOUND = 'Почта не найдена!',

  IP_NOT_FOUND = 'IP пользователя не установлен!',
  UA_NOT_FOUND = 'User-Agent пользователя не установлен!',
  FINGERPRINT_NOT_FOUND = 'Fingerprint пользователя не установлен!',

  TOKEN_EXPIRED = 'Ваша сессия истекла!',
  TOKEN_SUCCESS = 'Токен успешно обновлен!',
}
