import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import Estate from 'App/Models/RealEstates/Estate'
import EstateValidator from 'App/Validators/RealEstates/EstateValidator'
import { ExtractModelRelations } from '@ioc:Adonis/Lucid/Orm'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class EstateService extends BaseService {
  public static async getAll(columns: typeof Estate['columns'][number][], relations?: ExtractModelRelations<Estate>[]): Promise<Estate[]> {
    let query = Estate.query().select(columns)

    if (relations) {
      for (let item of relations) {
        query = query.preload(item)
      }
    }

    return await query
  }

  public static async paginate({ baseURL, page, columns, limit, orderBy, orderByColumn, relations }: GetAllConfig<typeof Estate['columns'][number], Estate>): Promise<Estate[]> {
    if (!columns)
      columns = ['id', 'name', 'slug', 'realEstateTypeId']

    let query = Estate.query().select(columns)
    if (relations) {
      for (let item of relations) {
        query = query.preload(item)
      }
    }

    return await query.get({
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