import { ResponseApiError, ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class ResponseService {
  public static success(message: ResponseMessages, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 200,
      code: ResponseCodes.SUCCESS,
    }
  }
}
