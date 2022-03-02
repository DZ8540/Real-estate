import Env from '@ioc:Adonis/Core/Env'
import TokenService from 'App/Services/TokenService'
import ClientException from 'App/Exceptions/ClientException'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { COOKIE_REFRESH_TOKEN_KEY } from 'Contracts/auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckToken {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let token: string | null = request.cookie(COOKIE_REFRESH_TOKEN_KEY, null)

    if (!token)
      throw new ClientException(ResponseMessages.TOKEN_EXPIRED)

    try {
      TokenService.validateToken(token, Env.get('REFRESH_TOKEN_KEY'))
    } catch (err: Error | any) {
      await TokenService.deleteRefreshToken(token)

      response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)
      throw new ClientException(ResponseMessages.TOKEN_EXPIRED)
    }

    await next()
  }
}
