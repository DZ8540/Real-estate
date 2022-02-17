import TokenService from 'App/Services/TokenService'
import ClientException from 'App/Exceptions/ClientException'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAccessToken {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    let token: string | null = request.input('token', null)

    if (!token)
      throw new ClientException(ResponseMessages.TOKEN_EXPIRED)

    try {
      TokenService.validateAccessToken(token)
    } catch (err: Error | any) {
      throw new ClientException(ResponseMessages.TOKEN_EXPIRED)
    }

    await next()
  }
}
