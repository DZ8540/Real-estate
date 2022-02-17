import News from 'App/Models/News'
import BaseService from './BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import NewsValidator from 'App/Validators/NewsValidator'
import { NEWS_PATH } from 'Config/drive'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class NewsService extends BaseService {
  public static async getAll({ baseURL, page, columns, limit, orderBy, orderByColumn }: GetAllConfig<typeof News['columns'][number]>): Promise<News[]> {
    if (!columns)
      columns = ['id', 'image', 'title', 'slug', 'createdAt']

    return await News.query().select(columns).get({ baseURL, page, limit, orderBy, orderByColumn })
  }

  public static async get({ column, val, trx }: GetConfig<News>): Promise<News> {
    let item: News | null

    try {
      item = await News.findBy(column, val, { client: trx })
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
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NEWS_NOT_FOUND } as Error
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
    let item: News | null
    let image: News['image'] = undefined

    try {
      item = await News.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NEWS_NOT_FOUND } as Error

    try {
      if (payload.image) {
        if (item.image)
          await Drive.delete(item.image)

        await payload.image.moveToDisk(NEWS_PATH)
        image = `${NEWS_PATH}/${payload.image.fileName}`
      }

      return await item.merge({ ...payload, image }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(column: typeof News['columns'][number], val: any): Promise<void> {
    let item: News | null

    try {
      item = await News.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      if (item.image)
        await Drive.delete(item.image)

      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NEWS_NOT_FOUND } as Error
    }
  }

  public static async random(limit: number): Promise<News[]> {
    try {
      let news: News[] = []

      for (let i = 0; i < limit; ) {
        let item: News = await News.query().random()

        // * For remove double items
        if (!(news.find((val) => val.id == item.id))) {
          news.push(item)
          i++
        }
      }

      return news
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
