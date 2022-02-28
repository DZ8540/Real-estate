import Logger from '@ioc:Adonis/Core/Logger'
import UsersReviewsReport from 'App/Models/Users/UsersReviewsReport'
import UsersReviewsReportValidator from 'App/Validators/Api/Users/UsersReviewsReportValidator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof UsersReviewsReport['columns'][number]
type ValidatorPayload = UsersReviewsReportValidator['schema']['props']

export default class UsersReviewsReportService {
  public static async paginate(config: PaginateConfig<Columns, UsersReviewsReport>, columns: Columns[] = []): Promise<ModelPaginatorContract<UsersReviewsReport>> {
    let query = UsersReviewsReport.query()

    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.select(columns).get(config)
  }

  public static async get(payload: ValidatorPayload, config: ServiceConfig<UsersReviewsReport> = {}): Promise<UsersReviewsReport> {
    let item: UsersReviewsReport | null

    try {
      item = await UsersReviewsReport.query({ client: config.trx }).where('usersReview_id', payload.usersReviewId).andWhere('user_id', payload.userId).first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USERS_REVIEWS_REPORT_NOT_FOUND } as Error

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

  public static async getById(id: UsersReviewsReport['id'], config: ServiceConfig<UsersReviewsReport> = {}): Promise<UsersReviewsReport> {
    let item: UsersReviewsReport | null

    try {
      item = await UsersReviewsReport.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USERS_REVIEWS_REPORT_NOT_FOUND } as Error

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

  public static async create(payload: ValidatorPayload, config: ServiceConfig<UsersReviewsReport> = {}): Promise<void> {
    try {
      await UsersReviewsReport.create(payload, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(payload: ValidatorPayload, config: ServiceConfig<UsersReviewsReport> = {}): Promise<void> {
    let item: UsersReviewsReport

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

  public static async deleteById(id: UsersReviewsReport['id'], config: ServiceConfig<UsersReviewsReport> = {}): Promise<void> {
    let item: UsersReviewsReport

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
