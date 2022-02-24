import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import ServicesType from 'App/Models/Services/ServicesType'
import ServicesTypeValidator from 'App/Validators/Services/ServicesTypeValidator'
import { Error, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class ServicesTypeService extends BaseService {
  public static async getAll(columns: typeof ServicesType['columns'][number][] = ['id', 'slug', 'name']): Promise<ServicesType[]> {
    return await ServicesType.query().select(columns)
  }

  public static async get(slug: ServicesType['slug'], { trx }: ServiceConfig<ServicesType> = {}): Promise<ServicesType> {
    let item: ServicesType | null

    try {
      item = await ServicesType.findBy('slug', slug, { client: trx })
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
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.SERVICES_TYPES_NOT_FOUND } as Error
    }
  }

  public static async create(payload: ServicesTypeValidator['schema']['props'], { trx }: ServiceConfig<ServicesType> = {}): Promise<ServicesType> {
    try {
      return (await ServicesType.create(payload, { client: trx }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: ServicesType['slug'], payload: ServicesTypeValidator['schema']['props'], config: ServiceConfig<ServicesType> = {}): Promise<ServicesType> {
    let item: ServicesType

    try {
      item = await this.get(slug, config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.SERVICES_TYPES_NOT_FOUND } as Error
    }
  }

  public static async delete(slug: ServicesType['slug'], config: ServiceConfig<ServicesType> = {}): Promise<void> {
    let item: ServicesType

    try {
      item = await this.get(slug, config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.SERVICES_TYPES_NOT_FOUND } as Error
    }
  }
}
