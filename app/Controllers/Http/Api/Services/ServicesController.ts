import Service from 'App/Models/Services/Service'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import ServiceService from 'App/Services/Services/ServiceService'
import ServiceValidator from 'App/Validators/Api/Services/ServiceValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class ServicesController {
  public async all({ request, response }: HttpContextContract) {
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
      let services: Service[] = await ServiceService.search(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, services))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
