import Question from 'App/Models/Question'
import Logger from '@ioc:Adonis/Core/Logger'
import QuestionValidator from 'App/Validators/Api/QuestionValidator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof Question['columns'][number]

export default class QuestionService {
  public static async paginate(config: PaginateConfig<Columns, Question>, columns: Columns[] = []): Promise<ModelPaginatorContract<Question>> {
    return await Question.query().select(columns).get(config)
  }

  public static async get(id: Question['id'], { trx }: ServiceConfig<Question> = {}): Promise<Question> {
    let item: Question | null

    try {
      item = await Question.find(id, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.QUESTION_NOT_FOUNT } as Error

    return item
  }

  public static async create(payload: QuestionValidator['schema']['props'], { trx }: ServiceConfig<Question> = {}): Promise<Question> {
    try {
      return await Question.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(id: Question['id'], { trx }: ServiceConfig<Question> = {}): Promise<void> {
    let item: Question

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
