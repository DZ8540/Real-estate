import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import Response from 'App/Models/Services/Response'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ResponseValidator from 'App/Validators/Api/Services/ResponseValidator'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { Error } from 'Contracts/services'
import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages, ResponsesStatusTypes } from 'Contracts/response'

export default class ResponseService {
  public static async paginateIncumings(userId: User['id'], payload: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Response>> {
    try {
      return await Response
        .query()
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

  public static async create(payload: ResponseValidator['schema']['props']): Promise<Response> {
    let response: Response
    const trx: TransactionClientContract = await Database.transaction()
    const responsePayload: Partial<ModelAttributes<Response>> = {
      price: payload.price,
      priceType: payload.priceType,
      userId: payload.userId,
      status: ResponsesStatusTypes.UNDER_CONSIDERATION,
      description: payload.description,
      serviceId: payload.serviceId,
    }

    try {
      response = await Response.create(responsePayload, { client: trx })
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      // Not need use at now
      // if (payload.images)
      //   await this.createImages(response.id, payload.images, trx)

      await trx.commit()
      return response
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
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

  // Not need use at now
  // private static async createImages(responseId: Response['id'], images: NonNullable<ResponseValidator['schema']['props']['images']>, trx: TransactionClientContract): Promise<void> {
  //   const payload: Partial<ModelAttributes<ResponsesImage>>[] = []

  //   try {
  //     for (const item of images) {
  //       await item.moveToDisk(RESPONSES_PATH)
  //       payload.push({
  //         responseId,
  //         image: `${RESPONSES_PATH}/${item.fileName}`,
  //       })
  //     }
  //   } catch (err: any) {
  //     Logger.error(err)
  //     throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
  //   }

  //   try {
  //     await ResponsesImage.createMany(payload, { client: trx })
  //   } catch (err: any) {
  //     Logger.error(err)
  //     throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
  //   }
  // }
}
