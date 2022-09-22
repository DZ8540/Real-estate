import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import ServiceService from './Services/ServiceService'
import Service from 'App/Models/Services/Service'
import Response from 'App/Models/Response/Response'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ServiceResponseValidator from 'App/Validators/Api/Responses/ServiceResponseValidator'
import { Error } from 'Contracts/services'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseApiError, ResponseCodes, ResponseMessages, ResponsesStatusTypes } from 'Contracts/response'
import RealEstateResponseValidator from 'App/Validators/Api/Responses/RealEstateResponseValidator'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { RESPONSES_PATH } from 'Config/drive'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import ResponsesImage from 'App/Models/Response/ResponsesImage'
import RealEstate from 'App/Models/RealEstates/RealEstate'

type InProcessConfig = {
  type: 'owner' | 'executor',
  statusType: ResponsesStatusTypes,
}

export default class ResponseService {
  public static success(message: ResponseMessages, body?: ResponseApiError['body']): ResponseApiError {
    return {
      body,
      message,
      status: 200,
      code: ResponseCodes.SUCCESS,
    }
  }

  /**
   * * For real estates and services responses
   */

  public static async paginateRealEstateResponses(realEstateId: RealEstate['id'], payload: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Response>> {
    try {
      return await Response
        .query()
        .whereHas('realEstate', (query) => {
          query.where('realEstate_id', realEstateId)
        })
        .orderByRaw('RANDOM()')
        .get(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async paginateIncumings(userId: User['id'], payload: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Response>> {
    try {
      return await Response
        .query()
        .where('status', ResponsesStatusTypes.UNDER_CONSIDERATION)
        .whereHas('service', (query) => {
          query.where('user_id', userId)
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
      return await query.get(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: (ServiceResponseValidator & RealEstateResponseValidator)['schema']['props']): Promise<Response> {
    let item: Response
    let trx: TransactionClientContract | undefined = undefined
    const responsePayload: Partial<ModelAttributes<Response>> = {
      userId: payload.userId,
      status: ResponsesStatusTypes.UNDER_CONSIDERATION,
      description: payload.description,
      serviceId: payload.serviceId,
    }

    if (payload.images)
      trx = await Database.transaction()

    try {
      item = await Response.create(responsePayload, { client: trx })
    } catch (err: any) {
      if (trx)
        trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (payload.images) {
      try {
        await this.uploadImages(item.id, payload.images, trx!)
      } catch (err: Error | any) {
        trx!.rollback()

        throw err
      }
    }

    return item
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

  private static async uploadImages(responseId: Response['id'], images: MultipartFileContract[], trx: TransactionClientContract): Promise<void> {
    const responseImages: Partial<ModelAttributes<ResponsesImage>>[] = []

    try {
      for (const image of images) {
        await image.moveToDisk(RESPONSES_PATH)

        responseImages.push({ responseId, image: `${RESPONSES_PATH}/${responseId}/${image.fileName}` })
      }
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await ResponsesImage.createMany(responseImages, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
