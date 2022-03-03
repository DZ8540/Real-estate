import Banner from 'App/Models/Banner'
import BaseService from './BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import BannerValidator from 'App/Validators/BannerValidator'
import { Error } from 'Contracts/services'
import { BANNERS_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

type Columns = typeof Banner['columns'][number]
type ValidatorPayload = BannerValidator['schema']['props']

export default class BannerService extends BaseService {
  public static async getAll(columns: Columns[] = []): Promise<Banner[]> {
    try {
      return await Banner.query().select(columns)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(id: Banner['id']): Promise<Banner> {
    let item: Banner | null

    try {
      item = await Banner.find(id)
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
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.BANNER_NOT_FOUND } as Error
    }
  }

  public static async create(payload: ValidatorPayload): Promise<Banner> {
    let image: Banner['image']

    try {
      await payload.image.moveToDisk(BANNERS_PATH)
      image = `${BANNERS_PATH}/${payload.image.fileName}`
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      return (await Banner.create({
        ...payload,
        image
      }))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(id: Banner['id'], payload: ValidatorPayload): Promise<Banner> {
    let item: Banner
    let image: Banner['image']

    try {
      item = await this.get(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await Drive.delete(item.image)

      await payload.image.moveToDisk(BANNERS_PATH)
      image = `${BANNERS_PATH}/${payload.image.fileName}`

      return await item.merge({ ...payload, image }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(id: Banner['id']): Promise<void> {
    let item: Banner

    try {
      item = await this.get(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await Drive.delete(item.image)

      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.BANNER_NOT_FOUND } as Error
    }
  }
}
