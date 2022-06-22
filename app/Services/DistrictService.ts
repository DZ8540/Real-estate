import District from 'App/Models/District'
import Logger from '@ioc:Adonis/Core/Logger'
import { Error, ServiceConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class DistrictService {
  public static async getAllByCity(city: District['city']): Promise<District[]> {
    try {
      return await District.query().where('city', city)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async getByNameAndCity(name: District['name'], city: District['city']): Promise<District> {
    let item: District | null

    try {
      item = await District.query().where('name', name).andWhere('city', city).first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }

  public static async create(name: District['name'], city: District['city'], { trx }: ServiceConfig<District> = {}): Promise<District> {
    try {
      return await District.create({ name, city }, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
