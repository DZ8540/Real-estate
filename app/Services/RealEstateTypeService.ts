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
    try {
      return (await RealEstateType.findBy(column, val, { client: trx }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
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
    try {
      return await (await RealEstateType.findBy(column, val))!.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(column: typeof RealEstateType['columns'][number], val: any): Promise<void> {
    try {
      await (await RealEstateType.findBy(column, val))!.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
