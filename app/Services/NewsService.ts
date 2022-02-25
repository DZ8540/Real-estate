import News from 'App/Models/News'
import BaseService from './BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import NewsValidator from 'App/Validators/NewsValidator'
import { NEWS_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof News['columns'][number]
type ValidatorPayload = NewsValidator['schema']['props']

export default class NewsService extends BaseService {
  public static async getAll(config: PaginateConfig<Columns>, columns: Columns[] = ['id', 'image', 'title', 'slug', 'createdAt']): Promise<News[]> {
    return await News.query().select(columns).get(config)
  }

  public static async get(slug: News['slug'], { trx }: ServiceConfig<News> = {}): Promise<News> {
    let item: News | null

    try {
      item = await News.findBy('slug', slug, { client: trx })
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

  public static async create(payload: ValidatorPayload, { trx }: ServiceConfig<News> = {}): Promise<News> {
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
      }, { client: trx }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(slug: News['slug'], payload: ValidatorPayload, { trx }: ServiceConfig<News> = {}): Promise<News> {
    let item: News
    let image: News['image'] = undefined

    try {
      item = await this.get(slug, { trx })
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

      return await item.merge({ ...payload, image }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(slug: News['slug'], { trx }: ServiceConfig<News> = {}): Promise<void> {
    let item: News

    try {
      item = await this.get(slug, { trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
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
