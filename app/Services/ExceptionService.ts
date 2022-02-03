import BaseService from './BaseService'
import TokenException from 'App/Exceptions/TokenException'
import ClientException from 'App/Exceptions/ClientException'
import MailerException from 'App/Exceptions/MailerException'
import ServerException from 'App/Exceptions/ServerException'
import DatabaseException from 'App/Exceptions/DatabaseException'
import ValidationException from 'App/Exceptions/ValidationException'
import { Error } from 'Contracts/services'
import { ResponseCodes } from 'Contracts/response'

export default class ExceptionService extends BaseService {
  constructor(err: Error) {
    super()

    switch (err.code) {
      case ResponseCodes.CLIENT_ERROR:
        return new ClientException(err.message, err.body)

      case ResponseCodes.DATABASE_ERROR:
        return new DatabaseException(err.message, err.body)

      case ResponseCodes.MAILER_ERROR:
        return new MailerException(err.message, err.body)

      case ResponseCodes.SERVER_ERROR:
        return new ServerException(err.message, err.body)

      case ResponseCodes.VALIDATION_ERROR:
        return new ValidationException(err.message, err.body)

      case ResponseCodes.TOKEN_EXPIRED:
        return new TokenException(err.message, err.body)

      default:
        break
    }
  }
}
