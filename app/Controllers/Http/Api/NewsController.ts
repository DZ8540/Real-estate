import News from 'App/Models/News'
import NewsService from 'App/Services/NewsService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewsController {
  public async all({ request, response }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']

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
      let news: News[] = await NewsService.getAll(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, news))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    let id: News['id'] = params.id

    try {
      let item: News = await NewsService.get({ column: 'id', val: id })

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async random({ request, response }: HttpContextContract) {
    let limit: number = request.input('limit', 1)

    try {
      let news: News[] = await NewsService.random(limit)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, news))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
