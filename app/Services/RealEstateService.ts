import BaseService from './BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import RealEstate from 'App/Models/RealEstate'
import Database from '@ioc:Adonis/Lucid/Database'
import RealEstateValidator from 'App/Validators/RealEstateValidator'
import { REAL_ESTATE_PATH } from 'Config/drive'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstateService extends BaseService {
  public static async getAll({ baseURL, page, columns, limit, orderBy, orderByColumn, relations }: GetAllConfig<typeof RealEstate['columns'][number], RealEstate>): Promise<RealEstate[]> {
    if (!columns)
      columns = ['id', 'image', 'userId', 'roomType', 'price', 'totalArea', 'houseType', 'createdAt']

    let query = RealEstate.query().select(columns)
    if (relations) {
      for (let item of relations) {
        query = query.preload(item)
      }
    }

    return await query.get({ baseURL, page, limit, orderBy, orderByColumn })
  }

  public static async get({ column, val, relations }: GetConfig<RealEstate>): Promise<RealEstate> {
    let item: RealEstate | null

    try {
      item = await RealEstate.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATE_NOT_FOUND } as Error

    try {
      if (relations) {
        for (let relationItem of relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: RealEstateValidator['schema']['props']): Promise<RealEstate> {
    let item: RealEstate
    let image: string | undefined
    let imageBasePath: string
    let trx = await Database.transaction()

    try {
      item = await RealEstate.create({ ...payload, image }, { client: trx })

      imageBasePath = `${REAL_ESTATE_PATH}/${item.uuid}`
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (payload.image) {
        await payload.image.moveToDisk(imageBasePath)
        image = `${imageBasePath}/${payload.image.fileName}`
      }

      if (payload.images) {
        for (let imageItem of payload.images) {
          if (imageItem) {
            await imageItem.moveToDisk(`${imageBasePath}/images`)
            await item.related('images').create({ image: `${imageBasePath}/images/${imageItem.fileName}` })
          }
        }
      }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }

    await trx.commit()
    return item
  }

  public static async update({ column, val }: GetConfig<RealEstate>, payload: RealEstateValidator['schema']['props']): Promise<RealEstate> {
    let item: RealEstate
    let image: string | undefined
    let trx = await Database.transaction()
    let imageBasePath: string

    try {
      item = await this.get({ column, val, trx })

      imageBasePath = `${REAL_ESTATE_PATH}/${item.uuid}`
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      if (payload.image) {
        if (item.image)
          await Drive.delete(item.image)

        await payload.image.moveToDisk(imageBasePath)
        image = `${imageBasePath}/${payload.image.fileName}`
      }

      if (payload.images) {
        for (let value of item.images) {
          await Drive.delete(value.image)
          await value.delete()
        }

        for (let imageItem of payload.images) {
          if (imageItem) {
            await imageItem.moveToDisk(`${imageBasePath}/images`)
            await item.related('images').create({ image: `${imageBasePath}/images/${imageItem.fileName}` })
          }
        }
      }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await trx.commit()

      return await item.merge({ ...payload, image }).save()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(column: typeof RealEstate['columns'][number], val: any): Promise<void> {
    let item: RealEstate
    let trx = await Database.transaction()

    try {
      item = await this.get({ column, val, trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (item.image)
        await Drive.delete(item.image)

      for (let imageItem of item.images) {
        await Drive.delete(imageItem.image)
        await imageItem.delete()
      }

      await trx.commit()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async block(column: typeof RealEstate['columns'][number], val: any): Promise<RealEstate> {
    try {
      return (await this.get({ column, val })).merge({ isBanned: true }).save()
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async unblock(column: typeof RealEstate['columns'][number], val: any): Promise<RealEstate> {
    try {
      return (await this.get({ column, val })).merge({ isBanned: false }).save()
    } catch (err: Error | any) {
      throw err
    }
  }
}
