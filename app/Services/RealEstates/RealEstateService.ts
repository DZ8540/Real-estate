import BaseService from '../BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import RealEstateValidator from 'App/Validators/RealEstates/RealEstateValidator'
import RealEstateApiValidator from 'App/Validators/Api/RealEstates/RealEstateValidator'
import { REAL_ESTATE_PATH } from 'Config/drive'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstateService extends BaseService {
  public static async getAll(config: PaginateConfig<typeof RealEstate['columns'][number], RealEstate>, columns: typeof RealEstate['columns'][number][] = ['id', 'uuid', 'image', 'userId', 'roomType', 'price', 'totalArea', 'houseType', 'createdAt']): Promise<RealEstate[]> {
    let query = RealEstate.query().select(columns)
    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.get(config)
  }

  public static async get(uuid: RealEstate['uuid'], config: ServiceConfig<RealEstate> = {}): Promise<RealEstate> {
    let item: RealEstate | null

    try {
      item = await RealEstate.findBy('uuid', uuid, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATE_NOT_FOUND } as Error

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

  public static async create(payload: RealEstateValidator['schema']['props'], { trx }: ServiceConfig<RealEstate> = {}): Promise<RealEstate> {
    let item: RealEstate
    let image: string | undefined
    let imageBasePath: string

    if (!trx)
      trx = await Database.transaction()

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

  public static async update(uuid: RealEstate['uuid'], payload: RealEstateValidator['schema']['props'], { trx }: ServiceConfig<RealEstate> = {}): Promise<RealEstate> {
    let item: RealEstate
    let image: string | undefined
    let imageBasePath: string

    if (!trx)
      trx = await Database.transaction()

    try {
      item = await this.get(uuid, { trx })

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

  public static async delete(uuid: RealEstate['uuid'], { trx }: ServiceConfig<RealEstate> = {}): Promise<void> {
    let item: RealEstate

    if (!trx)
      trx = await Database.transaction()

    try {
      item = await this.get(uuid, { trx })
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

      if (item.images) {
        for (let imageItem of item.images) {
          await Drive.delete(imageItem.image)
          await imageItem.delete()
        }
      }

      await trx.commit()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async block(uuid: RealEstate['uuid'], { trx }: ServiceConfig<RealEstate> = {}): Promise<RealEstate> {
    try {
      return (await this.get(uuid, { trx })).merge({ isBanned: true }).save()
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async unblock(uuid: RealEstate['uuid'], { trx }: ServiceConfig<RealEstate> = {}): Promise<RealEstate> {
    try {
      return (await this.get(uuid, { trx })).merge({ isBanned: false }).save()
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async search(payload: RealEstateApiValidator['schema']['props']): Promise<RealEstate[]> {
    if (!payload.limit)
      payload.limit = 15

    try {
      let query = RealEstate.query().preload('images')

      for (let key in payload) {
        if (payload[key]) {
          switch (key) {
            // Skip this api's keys
            case 'page':
            case 'limit':
            case 'orderBy':
              break

            case 'districts':
              for (let item of payload[key]!) {
                query = query.orWhere('address', 'like', `%${item}%`)
              }
              break

            case 'addressOrResidentalComplex':
              query = query
                .where('residentalComplex', 'like', `%${payload[key]}%`)
                .orWhere('address', 'like', `%${payload[key]}%`)
              break

            case 'ceilingHeight':
            case 'yearOfConstruction': // @ts-ignore
              query = query.where(key, '>=', payload[key]!)
              break

            case 'WCTypes':
            case 'roomTypes':
            case 'repairTypes':
            case 'rentalTypes':
            case 'layoutTypes':
            case 'balconyTypes':
            case 'elevatorTypes':
            case 'houseBuildingTypes': {
              let keyWithoutS: string = ''
              let arrayKey: string[] = [...key]
              arrayKey.pop()
              keyWithoutS = arrayKey.join('')

              for (let item of payload[key]!) {
                query = query.orWhere(keyWithoutS, item!)
              }
              break
            }
            case 'startPrice':
            case 'startFloor':
            case 'startMaxFloor':
            case 'startTotalArea':
            case 'startLivingArea':
            case 'startKitchenArea': {
              let keyWithoutStart: string[] = [...key.replace('start', '')]
              let firstLetterLowerCase: string = keyWithoutStart.shift()!.toLowerCase()
              let keyWithoutFirstLetter: string = keyWithoutStart.join('')
              let fullKey: string = firstLetterLowerCase + keyWithoutFirstLetter

              query = query.where(fullKey, '>=', payload[key]!)
              break
            }
            case 'endPrice':
            case 'endFloor':
            case 'endMaxFloor':
            case 'endTotalArea':
            case 'endLivingArea':
            case 'endKitchenArea': {
              let keyWithoutEnd: string[] = [...key.replace('end', '')]
              let firstLetterLowerCase: string = keyWithoutEnd.shift()!.toLowerCase()
              let keyWithoutFirstLetter: string = keyWithoutEnd.join('')
              let fullKey: string = firstLetterLowerCase + keyWithoutFirstLetter

              query = query.where(fullKey, '<=', payload[key]!)
              break
            }
            default:
              query = query.where(key, payload[key])
              break
          }
        }
      }

      return await query.get({ page: payload.page, limit: payload.limit, orderBy: payload.orderBy })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
