import UsersReport from 'App/Models/Users/UsersReport'
import UsersReportService from 'App/Services/Users/UsersReportService'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersReportsController {
  public async index({ view, route, request }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)

    let columns: typeof UsersReport['columns'][number][] = ['id', 'fromId', 'toId', 'createdAt']
    let reports: UsersReport[] = await UsersReportService.paginate({ baseURL, page, relations: ['from', 'to'] }, columns)

    return view.render('pages/usersReports', { reports })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    let id: UsersReport['id'] = params.id

    try {
      await UsersReportService.deleteById(id)

      session.flash('success', ResponseMessages.USERS_REPORT_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
