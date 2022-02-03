import TokenService from 'App/Services/TokenService'
import ClientException from 'App/Exceptions/ClientException'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { COOKIE_REFRESH_TOKEN_KEY } from 'Contracts/auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckToken {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let refreshToken: string | null = request.cookie(COOKIE_REFRESH_TOKEN_KEY, null)

    if (!refreshToken)
      throw new ClientException(ResponseMessages.TOKEN_EXPIRED)

    try {
      TokenService.validateRefreshToken(refreshToken)
    } catch (err: Error | any) {
      await TokenService.deleteRefreshToken(refreshToken)
      response.cookie(COOKIE_REFRESH_TOKEN_KEY, null, { path: '/api/auth' })
      throw new ClientException(ResponseMessages.TOKEN_EXPIRED)
    }

    await next()
  }
}
