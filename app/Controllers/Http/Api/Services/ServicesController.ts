import Logger from '@ioc:Adonis/Core/Logger'
import Service from 'App/Models/Services/Service'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ServiceService from 'App/Services/Services/ServiceService'
import ServiceValidator from 'App/Validators/Services/ServiceValidator'
import ServiceApiValidator from 'App/Validators/Api/Services/ServiceValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class ServicesController {
  public async all({ request, response }: HttpContextContract) {
    let payload: ServiceApiValidator['schema']['props']

    try {
      payload = await request.validate(ServiceApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let services: ModelPaginatorContract<Service> = await ServiceService.search(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, services))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ response, params }: HttpContextContract) {
    const id: Service['id'] = params.id

    try {
      const item: Service = await ServiceService.get(id, { relations: ['labels'] })

      try {
        await item.load('subService', (query) => {
          query.preload('type')
        })
      } catch (err: any) {
        Logger.error(err)
        throw { message: ResponseMessages.ERROR, code: ResponseCodes.DATABASE_ERROR } as Error
      }

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async add({ request, response }: HttpContextContract) {
    let payload: ServiceValidator['schema']['props']

    try {
      payload = await request.validate(ServiceValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let item: Service = await ServiceService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SERVICE_CREATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    let payload: ServiceValidator['schema']['props']
    let id: Service['id'] = params.id

    try {
      payload = await request.validate(ServiceValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let item: Service = await ServiceService.update(id, payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SERVICE_UPDATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    let id: Service['id'] = params.id

    try {
      await ServiceService.delete(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.SERVICE_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
