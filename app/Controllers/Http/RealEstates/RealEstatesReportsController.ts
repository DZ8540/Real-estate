import RealEstatesReport from 'App/Models/RealEstates/RealEstatesReport'
import RealEstatesReportService from 'App/Services/RealEstates/RealEstatesReportService'
import RealEstatesReportValidator from 'App/Validators/Api/RealEstates/RealEstatesReportValidator'
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

  public async destroy({ request, response, session }: HttpContextContract) {
    let payload = await request.validate(RealEstatesReportValidator)

    try {
      await RealEstatesReportService.delete(payload)

      session.flash('success', ResponseMessages.REAL_ESTATES_REPORT_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
