import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/Users/User'
import AuthService from 'App/Services/AuthService'
import TokenService from 'App/Services/TokenService'
import UserService from 'App/Services/Users/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import ActivateUserValidator from 'App/Validators/Users/ActivateUserValidator'
import { Error } from 'Contracts/services'
import { TokenCredentials } from 'Contracts/tokens'
import { COOKIE_REFRESH_TOKEN_KEY } from 'Contracts/auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

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
    let user: User
    let payload: LoginValidator['schema']['props']
    let tokens: { access: string, refresh: string }

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
      user = await AuthService.login(payload)

      tokens = TokenService.generateTokens({
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      })
      let tokenCredentials: TokenCredentials = {
        token: tokens.refresh,
        fingerprint: request.header('User-Fingerprint')!,
        ua: request.header('User-Agent')!,
        ip: request.ip(),
        userId: user.id,
      }

      await TokenService.createRefreshToken(tokenCredentials)
      response.cookie(COOKIE_REFRESH_TOKEN_KEY, tokens.refresh, { maxAge: Env.get('REFRESH_TOKEN_TIME'), path: '/api/auth' })
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }

    return response
      .status(200)
      .send(ResponseService.success(ResponseMessages.USER_LOGIN, {
        user,
        tokens: { access: tokens.access },
      }))
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
    let tokens: { access: string, refresh: string }
    let payload = request.input('token')
    let userToken: string = request.cookie(COOKIE_REFRESH_TOKEN_KEY)!

    let fingerprint: string = request.header('User-Fingerprint')!
    let ua: string = request.header('User-Agent')!
    let ip: string = request.ip()

    try {
      tokens = await TokenService.refreshToken({ userToken, fingerprint, ua, ip, payload })
    } catch (err: Error | any) {
      response.clearCookie(COOKIE_REFRESH_TOKEN_KEY)
      throw new ExceptionService(err)
    }

    return response
      .status(200)
      .send(ResponseService.success(ResponseMessages.TOKEN_SUCCESS, {
        tokens: { access: tokens.access }
      }))
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
