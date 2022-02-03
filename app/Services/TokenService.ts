import Token from 'App/Models/Token'
import Env from '@ioc:Adonis/Core/Env'
import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import { sign, verify } from 'jsonwebtoken'
import { TokenCredentials, TokenPayload } from 'Contracts/tokens'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, RefreshRefreshTokenConfig } from 'Contracts/services'

export default class TokenService extends BaseService {
  private static readonly accessKey: string = Env.get('ACCESS_TOKEN_KEY')
  private static readonly accessTime: string = Env.get('ACCESS_TOKEN_TIME')
  private static readonly refreshKey: string = Env.get('REFRESH_TOKEN_KEY')
  private static readonly refreshTime: string = Env.get('REFRESH_TOKEN_TIME')

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

  public static generateTokens(payload: TokenPayload): { access: string, refresh: string } {
    let access: string = sign(payload, this.accessKey, { expiresIn: this.accessTime })
    let refresh: string = sign(payload, this.refreshKey, { expiresIn: this.refreshTime })

    return { access, refresh }
  }

  public static async createRefreshToken(payload: TokenCredentials): Promise<void> {
    try {
      (await Token.create(payload))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async refreshToken(config: RefreshRefreshTokenConfig): Promise<{ access: string, refresh: string }> {
    let currentToken: Token

    try {
      currentToken = await this.getRefreshToken('token', config.userToken)

      if (currentToken.fingerprint != config.fingerprint || currentToken.ua != config.ua || currentToken.ip != config.ip)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    } catch (err: Error | any) {
      if (currentToken!)
        await currentToken.delete()

      throw err
    }

    try {
      let validateData: TokenPayload = this.validateAccessToken(config.payload)
      let payload: TokenPayload = {
        uuid: validateData.uuid,
        firstName: validateData.firstName,
        lastName: validateData.lastName,
        email: validateData.email,
        roleId: validateData.roleId,
      }

      let tokens: { access: string, refresh: string } = this.generateTokens(payload)
      return tokens
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_EXPIRED } as Error
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

  public static validateAccessToken(token: string): TokenPayload {
    try {
      return verify(token, this.accessKey) as TokenPayload
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_EXPIRED } as Error
    }
  }

  public static validateRefreshToken(token: string): TokenPayload {
    try {
      return verify(token, this.refreshKey) as TokenPayload
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.TOKEN_EXPIRED, message: ResponseMessages.TOKEN_EXPIRED } as Error
    }
  }
}
