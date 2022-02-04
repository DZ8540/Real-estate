import BaseService from './BaseService'
import Estate from 'App/Models/Estate'
import Logger from '@ioc:Adonis/Core/Logger'
import EstateValidator from 'App/Validators/EstateValidator'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class EstateService extends BaseService {
  public static async getAll({ baseURL, page, columns, limit, orderBy, orderByColumn }: GetAllConfig<typeof Estate['columns'][number]>): Promise<Estate[]> {
    if (!columns)
      columns = ['id', 'name', 'slug', 'realEstateTypeId']

    return await Estate
      .query()
      .preload('realEstateType')
      .select(columns)
      .get({
        baseURL,
        page,
        limit,
        orderBy,
        orderByColumn,
      })
  }

  public static async get({ column, val, relations }: GetConfig<Estate>): Promise<Estate> {
    let item: Estate | null

    try {
      item = await Estate.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      if (relations) {
        for (let relationItem of relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ESTATE_NOT_FOUND } as Error
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
    let item: Estate | null

    try {
      item = await Estate.findBy(column, val)
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
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ESTATE_NOT_FOUND } as Error
    }
  }

  public static async delete(column: typeof Estate['columns'][number], val: any): Promise<void> {
    let item: Estate | null

    try {
      item = await Estate.findBy(column, val)
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
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ESTATE_NOT_FOUND } as Error
    }
  }
}
