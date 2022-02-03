import ClientException from 'App/Exceptions/ClientException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseMessages } from 'Contracts/response'

export default class CheckUserCredentials {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    if (!request.ip())
      throw new ClientException(ResponseMessages.IP_NOT_FOUND)

    if (!request.header('User-Agent', null))
      throw new ClientException(ResponseMessages.UA_NOT_FOUND)

    if (!request.header('User-Fingerprint', null))
      throw new ClientException(ResponseMessages.FINGERPRINT_NOT_FOUND)

    await next()
  }
}
