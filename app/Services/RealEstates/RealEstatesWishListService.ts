import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from '../Users/UserService'
import RealEstatesWishListValidator from 'App/Validators/Api/RealEstates/RealEstatesWishListValidator'
import { LucidRow } from '@ioc:Adonis/Lucid/Orm'
import { Error, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

type ValidatorPayload = RealEstatesWishListValidator['schema']['props']

export default class RealEstatesWishListService {
  public static async create(payload: ValidatorPayload, { trx }: ServiceConfig<LucidRow> = {}): Promise<void> {
    let user: User

    try {
      user = await UserService.getById(payload.userId, { trx })
    } catch (err: Error | any) {
      throw err
    }

    try {
      await user.related('realEstatesWishList').attach([payload.realEstateId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(payload: ValidatorPayload, { trx }: ServiceConfig<LucidRow> = {}): Promise<void> {
    let user: User

    try {
      user = await UserService.getById(payload.userId, { trx })
    } catch (err: Error | any) {
      throw err
    }

    try {
      await user.related('realEstatesWishList').detach([payload.realEstateId])
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
