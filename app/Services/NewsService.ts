import News from 'App/Models/News'
import BaseService from './BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import NewsValidator from 'App/Validators/NewsValidator'
import { NEWS_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'

export default class NewsService extends BaseService {
  public static async getAll(config: GetAllConfig<typeof News['columns'][number][]>): Promise<News[]> {
    if (!config.columns)
      config.columns = ['id', 'image', 'title', 'slug']

    return await News.query().get({ baseURL: config.baseURL, page: config.page })

    // try {
    //   return await News.query().get({ baseURL: config.baseURL, page: config.page })
    // } catch (err: any) {
    //   Logger.error(err)
    //   throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    // }
  }

  public static async get({ column, val, trx }: GetConfig<News>): Promise<News> {
    try {
      return (await News.findBy(column, val, { client: trx }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: NewsValidator['schema']['props']): Promise<News> {
    let image: News['image'] = undefined

    if (payload.image) {
      try {
        await payload.image.moveToDisk(NEWS_PATH)
        image = `${NEWS_PATH}/${payload.image.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
      }
    }

    try {
      return (await News.create({
        ...payload,
        image
      }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update({ column, val }: GetConfig<News>, payload: NewsValidator['schema']['props']): Promise<News> {
    let item: News
    let image: News['image'] = undefined

    try {
      item = (await News.findBy(column, val))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (payload.image) {
        if (item.image)
          await Drive.delete(item.image)

        await payload.image.moveToDisk(NEWS_PATH)
        image = `${NEWS_PATH}/${payload.image.fileName}`
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }

    return await item.merge({ ...payload, image }).save()
  }

  public static async delete(column: typeof News['columns'][number], val: any): Promise<void> {
    try {
      (await News.findBy(column, val))!.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
