import Label from 'App/Models/Label'
import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import LabelValidator from 'App/Validators/LabelValidator'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class LabelService extends BaseService {
  public static async getAll({ baseURL, page, columns, limit, orderBy, orderByColumn }: GetAllConfig<typeof Label['columns'][number]>): Promise<Label[]> {
    if (!columns)
      columns = ['id', 'name', 'createdAt']

    return await Label.query().select(columns).get({ baseURL, page, limit, orderBy, orderByColumn })
  }

  public static async get({ column, val }: GetConfig<Label>): Promise<Label> {
    let item: Label | null

    try {
      item = await Label.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    return item
  }

  public static async create(payload: LabelValidator['schema']['props'], trx?: TransactionClientContract): Promise<Label> {
    try {
      return await Label.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(column: typeof Label['columns'][number], val: any, payload: LabelValidator['schema']['props']): Promise<Label> {
    let item: Label | null

    try {
      item = await Label.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    return await item.merge(payload).save()
  }

  public static async delete(column: typeof Label['columns'][number], val: any): Promise<void> {
    let item: Label | null

    try {
      item = await Label.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.LABEL_NOT_FOUND } as Error

    await item.delete()
  }
}
