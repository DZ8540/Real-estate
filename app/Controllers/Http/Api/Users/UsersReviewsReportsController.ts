import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import UsersReviewsReportService from 'App/Services/Users/UsersReviewsReportService'
import UsersReviewsReportValidator from 'App/Validators/Api/Users/UsersReviewsReportValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class UsersReviewsReportsController {
  public async add({ request, response }: HttpContextContract) {
    let payload: UsersReviewsReportValidator['schema']['props']

    try {
      payload = await request.validate(UsersReviewsReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await UsersReviewsReportService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REVIEWS_REPORT_CREATED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    let payload: UsersReviewsReportValidator['schema']['props']

    try {
      payload = await request.validate(UsersReviewsReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await UsersReviewsReportService.delete(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REVIEWS_REPORT_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
