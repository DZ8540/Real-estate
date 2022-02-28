import Logger from '@ioc:Adonis/Core/Logger'
import UsersReport from 'App/Models/Users/UsersReport'
import UsersReportValidator from 'App/Validators/Api/Users/UsersReportValidator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof UsersReport['columns'][number]
type ValidatorPayload = UsersReportValidator['schema']['props']

export default class UsersReportService {
  public static async paginate(config: PaginateConfig<Columns, UsersReport>, columns: Columns[] = []): Promise<ModelPaginatorContract<UsersReport>> {
    let query = UsersReport.query().select(columns)

    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.get(config)
  }

  public static async get(payload: ValidatorPayload, config: ServiceConfig<UsersReport>): Promise<UsersReport> {
    let item: UsersReport | null

    try {
      item = await UsersReport.query({ client: config.trx }).where('fromId', payload.fromId).andWhere('toId', payload.toId).first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USERS_REPORT_NOT_FOUND } as Error

    try {
      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async getById(id: UsersReport['id'], config: ServiceConfig<UsersReport>): Promise<UsersReport> {
    let item: UsersReport | null

    try {
      item = await UsersReport.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USERS_REPORT_NOT_FOUND } as Error

    try {
      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: ValidatorPayload, { trx }: ServiceConfig<UsersReport> = {}): Promise<void> {
    try {
      await UsersReport.create(payload, { client: trx })
    } catch (err: any) {
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(payload: ValidatorPayload, config: ServiceConfig<UsersReport> = {}): Promise<void> {
    let item: UsersReport

    try {
      item = await this.get(payload, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async deleteById(id: UsersReport['id'], config: ServiceConfig<UsersReport> = {}): Promise<void> {
    let item: UsersReport

    try {
      item = await this.getById(id, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
