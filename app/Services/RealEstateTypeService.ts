import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import RealEstateType from 'App/Models/RealEstateType'
import RealEstateTypeValidator from 'App/Validators/RealEstateTypeValidator'
import { Error, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstateTypeService extends BaseService {
  public static async getAll(columns: typeof RealEstateType['columns'][number][] = ['id', 'slug', 'name']): Promise<RealEstateType[]> {
    return await RealEstateType.query().select(columns)
  }

  public static async get({ column, val, trx }: GetConfig<RealEstateType>): Promise<RealEstateType> {
    let item: RealEstateType | null

    try {
      item = await RealEstateType.findBy(column, val, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATE_TYPES_NOT_FOUND } as Error
    }
  }

  public static async create(payload: RealEstateTypeValidator['schema']['props']): Promise<RealEstateType> {
    try {
      return (await RealEstateType.create(payload))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update({ column, val }: GetConfig<RealEstateType>, payload: RealEstateTypeValidator['schema']['props']): Promise<RealEstateType> {
    let item: RealEstateType | null

    try {
      item = await RealEstateType.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATE_TYPES_NOT_FOUND } as Error
    }
  }

  public static async delete(column: typeof RealEstateType['columns'][number], val: any): Promise<void> {
    let item: RealEstateType | null

    try {
      item = await RealEstateType.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATE_TYPES_NOT_FOUND } as Error
    }
  }
}