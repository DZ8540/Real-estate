import BaseException from './BaseException'
import { ResponseCodes } from 'Contracts/response'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new TokenException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class TokenException extends BaseException {
  status: number = 400
  code: ResponseCodes = ResponseCodes.TOKEN_EXPIRED
}
