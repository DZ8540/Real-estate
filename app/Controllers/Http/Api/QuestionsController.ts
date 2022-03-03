import Question from 'App/Models/Question'
import QuestionService from 'App/Services/QuestionService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import QuestionValidator from 'App/Validators/Api/QuestionValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class QuestionsController {
  public async create({ request, response }: HttpContextContract) {
    let payload: QuestionValidator['schema']['props']

    try {
      payload = await request.validate(QuestionValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      let item: Question = await QuestionService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.QUESTION_CREATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
