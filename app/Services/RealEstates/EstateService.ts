import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import Estate from 'App/Models/RealEstates/Estate'
import EstateValidator from 'App/Validators/RealEstates/EstateValidator'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class EstateService extends BaseService {
  public static async getAll(columns: typeof Estate['columns'][number][] = [], { relations }: ServiceConfig<Estate>): Promise<Estate[]> {
    let query = Estate.query().select(columns)

    if (relations) {
      for (let item of relations) {
        query = query.preload(item)
      }
    }

    return await query
  }

  public static async paginate(config: PaginateConfig<typeof Estate['columns'][number], Estate>, columns: typeof Estate['columns'][number][] = ['id', 'name', 'slug', 'realEstateTypeId']): Promise<Estate[]> {
    let query = Estate.query().select(columns)
    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.get(config)
  }

  public static async get(slug: Estate['slug'], config: ServiceConfig<Estate> = {}): Promise<Estate> {
    let item: Estate | null

    try {
      item = await Estate.findBy('slug', slug, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ESTATE_NOT_FOUND } as Error
    }
  }

  public static async create(payload: EstateValidator['schema']['props'], { trx }: ServiceConfig<Estate> = {}): Promise<Estate> {
    try {
      return await Estate.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: Estate['slug'], payload: EstateValidator['schema']['props'], config: ServiceConfig<Estate> = {}): Promise<Estate> {
    let item: Estate

    try {
      item = await this.get(slug, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ESTATE_NOT_FOUND } as Error
    }
  }

  public static async delete(slug: Estate['slug'], config: ServiceConfig<Estate> = {}): Promise<void> {
    let item: Estate

    try {
      item = await this.get(slug, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ESTATE_NOT_FOUND } as Error
    }
  }
}
