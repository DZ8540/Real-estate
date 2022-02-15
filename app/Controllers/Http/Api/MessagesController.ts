import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import MessageService from 'App/Services/Chat/MessageService'
import MessageImageValidator from 'App/Validators/Chat/MessageImageValidator'
import { Error } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class MessagesController {
  public async addImages({ request, response }: HttpContextContract) {
    let payload: MessageImageValidator['schema']['props']

    try {
      payload = await request.validate(MessageImageValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      let images: string[] = await MessageService.addImages(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, images))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
