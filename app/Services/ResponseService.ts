import { ResponseApiError, ResponseCodes } from 'Contracts/response'

export default class ResponseService {
  public static clientError(message: string, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 400,
      code: ResponseCodes.CLIENT_ERROR,
    }
  }

  public static success(message: string, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 200,
      code: ResponseCodes.SUCCESS,
    }
  }

  public static serverError(message: string, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 500,
      code: ResponseCodes.SERVER_ERROR,
    }
  }

  public static validationError(message: string, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 400,
      code: ResponseCodes.VALIDATION_ERROR,
    }
  }

  public static mailerError(message: string, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 500,
      code: ResponseCodes.MAILER_ERROR,
    }
  }

  public static databaseError(message: string, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 500,
      code: ResponseCodes.DATABASE_ERROR,
    }
  }
}
