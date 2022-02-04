import BaseService from './BaseService'
import Estate from 'App/Models/Estate'
import Logger from '@ioc:Adonis/Core/Logger'
import EstateValidator from 'App/Validators/EstateValidator'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class EstateService extends BaseService {
  public static async getAll(config: GetAllConfig<typeof Estate['columns'][number][]>): Promise<Estate[]> {
    if (!config.columns)
      config.columns = ['id', 'name', 'slug', 'realEstateTypeId']

    return await Estate
      .query()
      .preload('realEstateType')
      .select(config.columns)
      .get({
        baseURL: config.baseURL,
        page: config.page,
        limit: config.limit,
      })
  }

  public static async get({ column, val, relations }: GetConfig<Estate>): Promise<Estate> {
    try {
      let item: Estate = (await Estate.findBy(column, val))!

      if (relations) {
        for (let relationItem of relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR } as Error
    }
  }

  public static async create(payload: EstateValidator['schema']['props']): Promise<Estate> {
    try {
      return await Estate.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(column: typeof Estate['columns'][number], val: any, payload: EstateValidator['schema']['props']): Promise<Estate> {
    try {
      return await (await Estate.findBy(column, val))!.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(column: typeof Estate['columns'][number], val: any): Promise<void> {
    try {
      await (await Estate.findBy(column, val))!.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
