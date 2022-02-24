import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import RealEstatesWishListService from 'App/Services/RealEstates/RealEstatesWishListService'
import RealEstatesWishListValidator from 'App/Validators/Api/RealEstates/RealEstatesWishListValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstatesWishListsController {
  public async add({ request, response }: HttpContextContract) {
    let payload: RealEstatesWishListValidator['schema']['props']

    try {
      payload = await request.validate(RealEstatesWishListValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await RealEstatesWishListService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    let payload: RealEstatesWishListValidator['schema']['props']

    try {
      payload = await request.validate(RealEstatesWishListValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      await RealEstatesWishListService.delete(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATES_REPORT_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
