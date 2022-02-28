import UsersReview from 'App/Models/Users/UsersReview'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import UsersReviewService from 'App/Services/Users/UsersReviewService'
import UsersReviewValidator from 'App/Validators/Users/UsersReviewValidator'
import UsersReviewApiValidator from 'App/Validators/Api/UsersReviewValidator'
import { Error } from 'Contracts/services'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class UsersReviewsController {
  public async paginate({ request, response }: HttpContextContract) {
    let payload: UsersReviewApiValidator['schema']['props']

    try {
      payload = await request.validate(UsersReviewApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      let data: ModelObject[] = await UsersReviewService.getAllUsersReviews(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async add({ request, response }: HttpContextContract) {
    let payload: UsersReviewValidator['schema']['props']

    try {
      payload = await request.validate(UsersReviewValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      let item: UsersReview = await UsersReviewService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REVIEW_CREATED, item.serialize()))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
