import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import RealEstateType from 'App/Models/RealEstates/RealEstateType'
import RealEstateTypeValidator from 'App/Validators/RealEstates/RealEstateTypeValidator'
import { Error, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstateTypeService extends BaseService {
  public static async getAll({ relations }: ServiceConfig<RealEstateType> = {}, columns: typeof RealEstateType['columns'][number][] = ['id', 'slug', 'name']): Promise<RealEstateType[]> {
    let query = RealEstateType.query().select(columns)

    if (relations) {
      for (let item of relations) {
        query = query.preload(item)
      }
    }

    return await query
  }

  public static async get(slug: RealEstateType['slug'], { trx }: ServiceConfig<RealEstateType> = {}): Promise<RealEstateType> {
    let item: RealEstateType | null

    try {
      item = await RealEstateType.findBy('slug', slug, { client: trx })
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

  public static async create(payload: RealEstateTypeValidator['schema']['props'], { trx }: ServiceConfig<RealEstateType> = {}): Promise<RealEstateType> {
    try {
      return (await RealEstateType.create(payload, { client: trx }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: RealEstateType['slug'], payload: RealEstateTypeValidator['schema']['props'], config: ServiceConfig<RealEstateType> = {}): Promise<RealEstateType> {
    let item: RealEstateType

    try {
      item = await this.get(slug, config)
    } catch (err: Error | any) {
      throw err
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

  public static async delete(slug: RealEstateType['slug'], config: ServiceConfig<RealEstateType> = {}): Promise<void> {
    let item: RealEstateType

    try {
      item = await this.get(slug, config)
    } catch (err: Error | any) {
      throw err
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
