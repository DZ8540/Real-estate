import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import UsersReportService from 'App/Services/Users/UsersReportService'
import UsersReportValidator from 'App/Validators/Api/Users/UsersReportValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class UsersReportsController {
  public async add({ request, response }: HttpContextContract) {
    let payload: UsersReportValidator['schema']['props']

    try {
      payload = await request.validate(UsersReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await UsersReportService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REPORT_CREATED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    let payload: UsersReportValidator['schema']['props']

    try {
      payload = await request.validate(UsersReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await UsersReportService.delete(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATES_REPORT_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
