import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import Estate from 'App/Models/RealEstates/Estate'
import EstateValidator from 'App/Validators/RealEstates/EstateValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof Estate['columns'][number]
type ValidatorPayload = EstateValidator['schema']['props']

export default class EstateService extends BaseService {
  public static async getAll(columns: Columns[] = [], { relations }: ServiceConfig<Estate>): Promise<Estate[]> {
    let query = Estate.query().select(columns)

    if (relations) {
      for (let item of relations) {
        query = query.preload(item)
      }
    }

    return await query
  }

  public static async paginate(config: PaginateConfig<Columns, Estate>, columns: Columns[] = ['id', 'name', 'slug', 'realEstateTypeId']): Promise<Estate[]> {
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

  public static async create(payload: ValidatorPayload, { trx }: ServiceConfig<Estate> = {}): Promise<Estate> {
    try {
      return await Estate.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: Estate['slug'], payload: ValidatorPayload, config: ServiceConfig<Estate> = {}): Promise<Estate> {
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
