import Question from 'App/Models/Question'
import QuestionService from 'App/Services/QuestionService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class QuestionsController {
  public async index({ request, view, route }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)

    let columns: typeof Question['columns'][number][] = ['id', 'name', 'email', 'createdAt']
    let questions: ModelPaginatorContract<Question> = await QuestionService.paginate({ page, baseURL }, columns)

    return view.render('pages/questions/index', { questions })
  }

  public async show({ params, view, session, response }: HttpContextContract) {
    let id: Question['id'] = params.id

    try {
      let item: Question = await QuestionService.get(id)

      return view.render('pages/questions/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    let id: Question['id'] = params.id

    try {
      await QuestionService.delete(id)

      session.flash('success', ResponseMessages.QUESTION_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
