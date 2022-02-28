import Logger from '@ioc:Adonis/Core/Logger'
import UsersReview from 'App/Models/Users/UsersReview'
import UsersReviewValidator from 'App/Validators/Users/UsersReviewValidator'
import UsersReviewApiValidator from 'App/Validators/Api/UsersReviewValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

type Columns = typeof UsersReview['columns'][number]
type UsersReviewPayload = UsersReviewValidator['schema']['props']

export default class UsersReviewService {
  public static async paginate(config: PaginateConfig<Columns, UsersReview>, columns: Columns[] = ['id', 'rating', 'fromId', 'toId', 'createdAt']): Promise<ModelPaginatorContract<UsersReview>> {
    let query = UsersReview.query()
    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.select(columns).get(config)
  }

  public static async getAllUsersReviews(payload: UsersReviewApiValidator['schema']['props']): Promise<ModelObject[]> {
    if (!payload.limit)
      payload.limit = 10

    try {
      let data: ModelPaginatorContract<UsersReview> = await UsersReview.query().where('to_id', payload.userId).get(payload)

      return data.toJSON().data
    } catch (err: any) {
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(id: UsersReview['id'], config: ServiceConfig<UsersReview> = {}): Promise<UsersReview> {
    let item: UsersReview | null

    try {
      item = await UsersReview.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USERS_REVIEW_NOT_FOUND } as Error

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

  public static async create(payload: UsersReviewPayload, { trx }: ServiceConfig<UsersReview> = {}): Promise<UsersReview> {
    try {
      return await UsersReview.create(payload, { client: trx })
    } catch (err: any) {
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(id: UsersReview['id'], payload: UsersReviewPayload, { trx }: ServiceConfig<UsersReview> = {}): Promise<UsersReview> {
    let item: UsersReview

    try {
      item = await this.get(id, { trx })
    } catch (err: Error | any) {
      throw err
    }

    try {
      return await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(id: UsersReview['id'], { trx }: ServiceConfig<UsersReview> = {}): Promise<void> {
    let item: UsersReview

    try {
      item = await this.get(id, { trx })
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
