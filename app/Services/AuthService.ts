import Env from '@ioc:Adonis/Core/Env'
import BaseService from './BaseService'
import MailService from './MailService'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import TokenService from './TokenService'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from './Users/UserService'
import Database from '@ioc:Adonis/Lucid/Database'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import ChangeRememberPasswordValidator from 'App/Validators/Api/Auth/ChangeRememberPasswordValidator'
import CheckRememberPasswordTokenValidator from 'App/Validators/Api/Auth/CheckRememberPasswordTokenValidator'
import { Roles } from 'Config/users'
import { Error } from 'Contracts/services'
import { SignOptions } from 'jsonwebtoken'
import { LoginHeaders } from 'Contracts/auth'
import { MailerConfig } from '@ioc:Adonis/Addons/Mail'
import { TokenCredentials, TokenPayload } from 'Contracts/tokens'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

type ReturnLoginData = {
  user: User,
  accessToken: string,
  refreshToken: string,
}

export default class AuthService extends BaseService {
  public static async register(payload: RegisterValidator['schema']['props']): Promise<void> {
    let user: User
    let trx = await Database.transaction()

    try {
      user = await UserService.create(payload, { trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      await this.sendActivationMail(user)
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    await trx.commit()
  }

  public static async loginViaServer({ email, password }: LoginValidator['schema']['props']): Promise<User> {
    let user: User

    try {
      user = await UserService.getByEmail(email)
    } catch (err: Error | any) {
      throw err
    }

    if (!user.isActivated || !(await Hash.verify(user.password, password)))
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error

    try {
      await user.load('realEstatesWishList')
      await user.load('realEstatesReports')

      return user
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error
    }
  }

  public static async loginViaApi({ email, password }: LoginValidator['schema']['props'], headers: LoginHeaders): Promise<ReturnLoginData> {
    let user: User
    let accessToken: string
    let refreshToken: string
    let accessTokenParams: [TokenPayload, string, SignOptions]
    let refreshTokenParams: [TokenPayload, string, SignOptions]

    try {
      user = await UserService.getByEmail(email)

      let payload: TokenPayload = {
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      }

      accessTokenParams = [payload, Env.get('ACCESS_TOKEN_KEY'), { expiresIn: Env.get('ACCESS_TOKEN_TIME') }]
      refreshTokenParams = [payload, Env.get('REFRESH_TOKEN_KEY'), { expiresIn: Env.get('REFRESH_TOKEN_TIME') }]
    } catch (err: Error | any) {
      throw err
    }

    if (!user.isActivated || !(await Hash.verify(user.password, password)))
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error

    try {
      accessToken = TokenService.createToken(...accessTokenParams)
      refreshToken = TokenService.createToken(...refreshTokenParams)

      let tokenCredentials: TokenCredentials = {
        ...headers,
        token: refreshToken,
        userId: user.id,
      }

      await TokenService.createRefreshToken(tokenCredentials)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await user.load('realEstatesWishList')
      await user.load('realEstatesReports')

      return { user, accessToken, refreshToken }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error
    }
  }

  public static async checkAdmin(uuid: User['uuid']): Promise<void> {
    let currentUser: User
    let accessRoles: Roles[] = [Roles.ADMIN, Roles.MANAGER]

    try {
      currentUser = await UserService.get(uuid, { relations: ['role'] })
    } catch (err: Error | any) {
      throw err
    }

    try {
      if (!accessRoles.includes(currentUser.role.name as Roles))
        throw new Error()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NOT_ADMIN } as Error
    }
  }

  public static async rememberPassword(email: User['email']): Promise<any> {
    try {
      let user: User = await UserService.getByEmail(email)
      let userPayload: TokenPayload = {
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
      }

      let token: string = TokenService.createToken(userPayload, Env.get('REMEMBER_PASSWORD_TOKEN_KEY'), { expiresIn: Env.get('REMEMBER_PASSWORD_TOKEN_TIME') })

      let mailConfig: MailerConfig = {
        to: email,
        title: 'Восстановление пароля',
        template: 'emails/rememberPassword',
        data: { user, token }
      }
      await MailService.sendMail(mailConfig)
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async checkRememberPasswordToken(payload: CheckRememberPasswordTokenValidator['schema']['props']): Promise<void> {
    try {
      let tokenData: TokenPayload = TokenService.validateToken(payload.token, Env.get('REMEMBER_PASSWORD_TOKEN_KEY'))

      if (payload.email != tokenData.email)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async changeRememberPassword(payload: ChangeRememberPasswordValidator['schema']['props']): Promise<User> {
    try {
      await this.checkRememberPasswordToken(payload)
    } catch (err: Error | any) {
      throw err
    }

    try {
      return (await UserService.getByEmail(payload.email))
        .merge({ password: payload.password })
        .save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async sendActivationMail(user: User): Promise<void> {
    let config: MailerConfig = {
      to: user.email,
      title: 'Подтвердите свой аккаунт',
      template: 'emails/activation',
      data: { user },
    }

    try {
      await MailService.sendMail(config)
    } catch (err: Error | any) {
      throw err
    }
  }
}
