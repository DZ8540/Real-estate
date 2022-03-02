import Env from '@ioc:Adonis/Core/Env'
import AuthService from 'App/Services/AuthService'
import TokenService from 'App/Services/TokenService'
import UserService from 'App/Services/Users/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import ActivateUserValidator from 'App/Validators/Users/ActivateUserValidator'
import { Error } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { COOKIE_REFRESH_TOKEN_KEY, LoginHeaders } from 'Contracts/auth'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    let payload: RegisterValidator['schema']['props']

    try {
      payload = await request.validate(RegisterValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await AuthService.register(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REGISTER_SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async login({ request, response }: HttpContextContract) {
    let payload: LoginValidator['schema']['props']
    let headers: LoginHeaders = {
      fingerprint: request.header('User-Fingerprint')!,
      ua: request.header('User-Agent')!,
      ip: request.ip(),
    }

    try {
      payload = await request.validate(LoginValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.USER_NOT_FOUND,
        body: err.messages
      })
    }

    try {
      let data = await AuthService.loginViaApi(payload, headers)

      response.cookie(COOKIE_REFRESH_TOKEN_KEY, data.refreshToken, { maxAge: Env.get('REFRESH_TOKEN_TIME'), path: '/api/auth' })
      return response
        .status(200)
        .send(ResponseService.success(ResponseMessages.USER_LOGIN, {
          user: data.user.serializeForToken(),
          tokens: { access: data.accessToken },
        }))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async activate({ request, response }: HttpContextContract) {
    let payload: ActivateUserValidator['schema']['props']

    try {
      payload = await request.validate(ActivateUserValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await UserService.activate(payload.user)
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }

    return response.status(200).send(ResponseService.success(ResponseMessages.USER_ACTIVATED))
  }

  public async refresh({ request, response }: HttpContextContract) {
    let payload = request.input('token')
    let userToken: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)!

    let fingerprint: string = request.header('User-Fingerprint')!
    let ua: string = request.header('User-Agent')!
    let ip: string = request.ip()

    try {
      let tokens: { access: string, refresh: string } = await TokenService.refreshToken({ userToken, fingerprint, ua, ip, payload })
      response.cookie(COOKIE_REFRESH_TOKEN_KEY, tokens.refresh, { path: '/api/auth' })

      return response
        .status(200)
        .send(ResponseService.success(ResponseMessages.TOKEN_SUCCESS, {
          tokens: { access: tokens.access }
        }))
    } catch (err: Error | any) {
      response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)

      throw new ExceptionService(err)
    }
  }

  public async logout({ request, response }: HttpContextContract) {
    try {
      let userToken: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)

      await TokenService.deleteRefreshToken(userToken)

      response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }

    return response.status(200).send(ResponseService.success(ResponseMessages.USER_LOGOUT))
  }
}
