import RealEstatesReport from 'App/Models/RealEstatesReport'
import RealEstatesReportService from 'App/Services/RealEstateReportService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RealEstatesReportsController {
  public async index({ view, route, request }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)
    let reports: RealEstatesReport[] = await RealEstatesReportService.paginate({ baseURL, page, relations: ['realEstate', 'user'] })

    return view.render('pages/realEstatesReports', { reports })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    let id: RealEstatesReport['id'] = params.id

    try {
      await RealEstatesReportService.delete({ column: 'id', val: id })

      session.flash('success', ResponseMessages.REAL_ESTATE_REPORT_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
