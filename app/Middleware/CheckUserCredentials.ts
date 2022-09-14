import ClientException from 'App/Exceptions/ClientException'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckUserCredentials {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    try {
      if (!request.ip())
        throw new ClientException(ResponseMessages.IP_NOT_FOUND)

      if (!request.header('User-Agent', null))
        throw new ClientException(ResponseMessages.UA_NOT_FOUND)

      if (!request.header('User-Fingerprint', null))
        throw new ClientException(ResponseMessages.FINGERPRINT_NOT_FOUND)

      await next()
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
