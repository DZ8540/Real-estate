import User from 'App/Models/Users/User'
import UsersReview from 'App/Models/Users/UsersReview'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import UsersReviewService from 'App/Services/Users/UsersReviewService'
import UsersReviewValidator from 'App/Validators/Users/UsersReviewValidator'
import UsersReviewApiValidator from 'App/Validators/Api/Users/UsersReviewValidator'
import { Error, JSONPaginate } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class UsersReviewsController {
  public async paginate({ request, response, params }: HttpContextContract) {
    let payload: UsersReviewApiValidator['schema']['props']
    const currentUserId: User['id'] | undefined = params.currentUserId

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
      const data: JSONPaginate = await UsersReviewService.getAllUsersReviews(payload, currentUserId)

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
      const item: UsersReview = await UsersReviewService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REVIEW_CREATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    let payload: UsersReviewValidator['schema']['props']
    const id: UsersReview['id'] = params.id

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
      const item: UsersReview = await UsersReviewService.update(id, payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REVIEW_UPDATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    const id: UsersReview['id'] = params.id

    try {
      await UsersReviewService.delete(id)

      return response.status(200).send(ResponseService.success(ResponseMessages.USERS_REVIEW_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
