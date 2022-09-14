import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import ServiceService from './ServiceService'
import Service from 'App/Models/Services/Service'
import Response from 'App/Models/Services/Response'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ResponseValidator from 'App/Validators/Api/Services/ResponseValidator'
import { Error } from 'Contracts/services'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages, ResponsesStatusTypes } from 'Contracts/response'

type InProcessConfig = {
  type: 'owner' | 'executor',
  statusType: ResponsesStatusTypes,
}

export default class ResponseService {
  public static async paginateIncumings(userId: User['id'], payload: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Response>> {
    try {
      return await Response
        .query()
        .where('status', ResponsesStatusTypes.UNDER_CONSIDERATION)
        .whereHas('service', (query) => {
          query
            .preload('subService')
            .where('user_id', userId)
        })
        .get(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async paginateUserResponses(userId: User['id'], payload: ApiValidator['schema']['props'], statusType: ResponsesStatusTypes): Promise<ModelPaginatorContract<Response>> {
    try {
      return await Response
        .query()
        .where('status', statusType)
        .where('user_id', userId)
        .whereHas('service', (query) => {
          query.preload('subService')
        })
        .get(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async paginateUserConfigResponses(userId: User['id'], payload: ApiValidator['schema']['props'], config: InProcessConfig): Promise<ModelPaginatorContract<Response>> {
    let query = Response
      .query()
      .where('status', config.statusType)

    if (config.type === 'owner') {
      try {
        const servicesIds: Service['id'][] = await ServiceService.getUserServicesIds(userId)

        query = query.whereIn('service_id', servicesIds)
      } catch (err: Error | any) {
        throw err
      }
    } else {
      query = query.where('user_id', userId)
    }

    try {
      return await query
        .whereHas('service', (query) => {
          query.preload('subService')
        })
        .get(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: ResponseValidator['schema']['props']): Promise<Response> {
    const responsePayload: Partial<ModelAttributes<Response>> = {
      userId: payload.userId,
      status: ResponsesStatusTypes.UNDER_CONSIDERATION,
      description: payload.description,
      serviceId: payload.serviceId,
    }

    try {
      return await Response.create(responsePayload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async accept(id: Response['id']): Promise<Response> {
    try {
      return await this.update(id, ResponsesStatusTypes.IN_PROCESS)
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async complete(id: Response['id']): Promise<Response> {
    try {
      return await this.update(id, ResponsesStatusTypes.COMPLETED)
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async reject(id: Response['id']): Promise<void> {
    let item: Response

    try {
      item = await this.get(id)
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

  private static async get(id: Response['id']): Promise<Response> {
    let item: Response | null

    try {
      item = await Response.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }

  private static async update(id: Response['id'], status: ResponsesStatusTypes): Promise<Response> {
    let item: Response

    try {
      item = await this.get(id)
    } catch (err: Error | any) {
      throw err
    }

    try {
      return await item.merge({ status }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
