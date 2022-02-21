import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import RealEstatesReportService from 'App/Services/RealEstates/RealEstatesReportService'
import RealEstatesReportValidator from 'App/Validators/Api/RealEstates/RealEstatesReportValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstatesReportsController {
  public async add({ request, response }: HttpContextContract) {
    let payload: RealEstatesReportValidator['schema']['props']

    try {
      payload = await request.validate(RealEstatesReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await RealEstatesReportService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATES_REPORT_CREATED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    let payload: RealEstatesReportValidator['schema']['props']

    try {
      payload = await request.validate(RealEstatesReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await RealEstatesReportService.delete(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATES_REPORT_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
