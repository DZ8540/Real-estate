import UsersReport from 'App/Models/UsersReport'
import UsersReportService from 'App/Services/UsersReportService'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersReportsController {
  public async index({ view, route, request }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)
    let reports: UsersReport[] = await UsersReportService.paginate({ baseURL, page, relations: ['from', 'to'] })

    return view.render('pages/usersReports', { reports })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    let id: UsersReport['id'] = params.id

    try {
      await UsersReportService.delete({ column: 'id', val: id })

      session.flash('success', ResponseMessages.USERS_REPORT_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
