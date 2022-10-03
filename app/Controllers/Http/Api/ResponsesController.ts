import User from 'App/Models/Users/User'
import Response from 'App/Models/Response/Response'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import ExceptionService from 'App/Services/ExceptionService'
import ServiceResponseValidator from 'App/Validators/Api/Responses/ServiceResponseValidator'
import RealEstateResponseValidator from 'App/Validators/Api/Responses/RealEstateResponseValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages, ResponsesStatusTypes } from 'Contracts/response'

export default class ResponsesController {
  public async paginateRealEstateResponses({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const realEstateId: RealEstate['id'] = params.realEstateId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateRealEstateResponses(realEstateId, payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateIncumings({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const userId: User['id'] = params.userId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateIncumings(userId, payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateOutgoings({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const userId: User['id'] = params.userId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, ResponsesStatusTypes.UNDER_CONSIDERATION)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateCompleted({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const userId: User['id'] = params.userId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, ResponsesStatusTypes.COMPLETED)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async createServiceResponse({ request, response }: HttpContextContract) {
    let payload: ServiceResponseValidator['schema']['props']

    try {
      payload = await request.validate(ServiceResponseValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try { // @ts-ignore
      await ResponseService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async createRealEstateResponse({ request, response }: HttpContextContract) {
    let payload: RealEstateResponseValidator['schema']['props']

    try {
      payload = await request.validate(RealEstateResponseValidator)
      console.log(payload, request.all())
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ResponseService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async accept({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ResponseService.accept(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async complete({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ResponseService.complete(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async reject({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ResponseService.reject(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * In process
   */

  public async paginateOwnerInProcess({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const userId: User['id'] = params.userId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserConfigResponses(userId, payload, {
        type: 'owner',
        statusType: ResponsesStatusTypes.IN_PROCESS,
      })

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateExecutorInProcess({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const userId: User['id'] = params.userId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserConfigResponses(userId, payload, {
        type: 'executor',
        statusType: ResponsesStatusTypes.IN_PROCESS,
      })

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
