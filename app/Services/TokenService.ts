import Token from 'App/Models/Token'
import Env from '@ioc:Adonis/Core/Env'
import BaseService from './BaseService'
import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from './Users/UserService'
import { sign, SignOptions, verify } from 'jsonwebtoken'
import { TokenCredentials, TokenPayload } from 'Contracts/tokens'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, RefreshRefreshTokenConfig } from 'Contracts/services'

type ReturnRefreshTokenData = {
  access: string,
  refresh: string
}

export default class TokenService extends BaseService {
  public static createToken(payload: any, key: string, options: SignOptions = {}): string {
    return sign(payload, key, options)
  }

  public static async refreshToken(config: RefreshRefreshTokenConfig): Promise<{ user: User, tokens: ReturnRefreshTokenData }> {
    let user: User
    let currentToken: Token
    let accessToken: string
    let refreshToken: string

    try {
      currentToken = await this.getRefreshToken('token', config.userToken)

      // if (currentToken.fingerprint != config.fingerprint || currentToken.ua != config.ua || currentToken.ip != config.ip)
      //   throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    } catch (err: Error | any) {
      // if (currentToken!)
      //   await currentToken.delete()

      throw err
    }

    try {
      let validateData: TokenPayload = this.validateToken(config.userToken, Env.get('REFRESH_TOKEN_KEY'))
      let payload: TokenPayload = {
        uuid: validateData.uuid,
        firstName: validateData.firstName,
        lastName: validateData.lastName,
        email: validateData.email,
        roleId: validateData.roleId,
      }

      accessToken = this.createToken(payload, Env.get('ACCESS_TOKEN_KEY'), { expiresIn: Env.get('ACCESS_TOKEN_TIME') })
      refreshToken = this.createToken(payload, Env.get('REFRESH_TOKEN_KEY'), { expiresIn: Env.get('REFRESH_TOKEN_TIME') })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_EXPIRED } as Error
    }

    try {
      user = await UserService.getById(currentToken.userId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await currentToken.merge({ token: refreshToken }).save()

      return {
        user,
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        }
      }
    } catch (err: any) {
      await currentToken.delete()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async getRefreshToken(column: 'token', val: Token['token']): Promise<Token> {
    try {
      let item: Token = (await Token.findBy(column, val))!

      await item.load('user')
      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_EXPIRED } as Error
    }
  }

  public static async createRefreshToken(payload: TokenCredentials): Promise<void> {
    try {
      await Token.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async deleteRefreshToken(userToken: string): Promise<void> {
    try {
      (await this.getRefreshToken('token', userToken)).delete()
    } catch (err: Error | any) {
      Logger.error(err)
      throw err
    }
  }

  public static validateToken(token: string, key: string): TokenPayload {
    try {
      return verify(token, key) as TokenPayload
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_EXPIRED } as Error
    }
  }
}
