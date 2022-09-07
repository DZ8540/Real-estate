import User from 'App/Models/Users/User'
import Response from 'App/Models/Services/Response'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ServiceResponseService from 'App/Services/Services/ResponseService'
import ResponseValidator from 'App/Validators/Api/Services/ResponseValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages, ResponsesStatusTypes } from 'Contracts/response'

export default class ResponsesController {
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
      const responses: ModelPaginatorContract<Response> = await ServiceResponseService.paginateIncumings(userId, payload)

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
      const responses: ModelPaginatorContract<Response> = await ServiceResponseService.paginateUserResponses(userId, payload, ResponsesStatusTypes.UNDER_CONSIDERATION)

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
      const responses: ModelPaginatorContract<Response> = await ServiceResponseService.paginateUserResponses(userId, payload, ResponsesStatusTypes.COMPLETED)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: ResponseValidator['schema']['props']

    try {
      payload = await request.validate(ResponseValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ServiceResponseService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async accept({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ServiceResponseService.accept(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async complete({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ServiceResponseService.complete(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async reject({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ServiceResponseService.reject(id)

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
      const responses: ModelPaginatorContract<Response> = await ServiceResponseService.paginateUserConfigResponses(userId, payload, {
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
      const responses: ModelPaginatorContract<Response> = await ServiceResponseService.paginateUserConfigResponses(userId, payload, {
        type: 'executor',
        statusType: ResponsesStatusTypes.IN_PROCESS,
      })

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, responses))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
