import Service from 'App/Models/Services/Service'
import ServicesType from 'App/Models/Services/ServicesType'
import ServiceService from 'App/Services/Services/ServiceService'
import ServiceValidator from 'App/Validators/Services/ServiceValidator'
import ServicesTypeService from 'App/Services/Services/ServicesTypeService'
import { Error } from 'Contracts/services'
import { EXPERIENCE_TYPES } from 'Config/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServicesController {
  public async index({ view, route, request }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)

    let columns: typeof Service['columns'][number][] = ['id', 'experienceType', 'isBanned', 'userId', 'servicesTypeId', 'createdAt']
    let services: Service[] = await ServiceService.paginate({ baseURL, page, relations: ['servicesType', 'user'] }, columns)

    return view.render('pages/services/index', { services })
  }

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  public async show({ view, params, session, response }: HttpContextContract) {
    let id: Service['id'] = params.id

    try {
      let item: Service = await ServiceService.get(id, { relations: ['user', 'servicesType', 'labels'] })

      let labels: string[] | string = []
      for (let labelItem of item.labels) {
        labels.push(labelItem.name)
      }
      labels = labels.join(', ')

      return view.render('pages/services/show', { item, labels })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ view, session, response, params }: HttpContextContract) {
    let id: Service['id'] = params.id

    try {
      let columns: typeof ServicesType['columns'][number][] = ['id', 'name']
      let servicesTypes: ServicesType[] = await ServicesTypeService.getAll(columns)
      let item: Service = await ServiceService.get(id ,{ relations: ['user', 'servicesType', 'labels'] })

      let labels: string[] | string = []
      for (let labelItem of item.labels) {
        labels.push(labelItem.name)
      }
      labels = labels.join(', ')

      return view.render('pages/services/edit', { item, experienceTypes: EXPERIENCE_TYPES, servicesTypes, labels })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, session, response, params }: HttpContextContract) {
    let id: Service['id'] = params.id
    let payload = await request.validate(ServiceValidator)

    try {
      await ServiceService.update(id, payload)

      session.flash('success', ResponseMessages.SERVICE_UPDATED)
      return response.redirect().toRoute('services.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    let id: Service['id'] = params.id

    try {
      await ServiceService.delete(id)

      session.flash('success', ResponseMessages.SERVICE_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
