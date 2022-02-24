import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import Label from 'App/Models/Services/Label'
import LabelValidator from 'App/Validators/Services/LabelValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

export default class LabelService extends BaseService {
  public static async getAll(config: PaginateConfig<typeof Label['columns'][number]>, columns: typeof Label['columns'][number][] = ['id', 'name', 'createdAt']): Promise<Label[]> {
    let query = Label.query().select(columns)

    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.get(config)
  }

  public static async get(id: Label['id'], { trx }: ServiceConfig<Label> = {}): Promise<Label> {
    let item: Label | null

    try {
      item = await Label.find(id, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    return item
  }

  public static async getByName(name: Label['name'], { trx }: ServiceConfig<Label> = {}): Promise<Label> {
    let item: Label | null

    try {
      item = await Label.findBy('name', name, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    return item
  }

  public static async create(payload: LabelValidator['schema']['props'], { trx }: ServiceConfig<Label> = {}): Promise<Label> {
    try {
      return await Label.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(id: Label['id'], payload: LabelValidator['schema']['props']): Promise<Label> {
    let item: Label

    try {
      item = await this.get(id)
    } catch (err: Error | any) {
      throw err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    return await item.merge(payload).save()
  }

  public static async delete(id: Label['id']): Promise<void> {
    let item: Label

    try {
      item = await this.get(id)
    } catch (err: Error | any) {
      throw err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    await item.delete()
  }
}
