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
}
