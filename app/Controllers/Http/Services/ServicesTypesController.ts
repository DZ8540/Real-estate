import ServicesType from 'App/Models/Services/ServicesType'
import ServicesTypeService from 'App/Services/Services/ServicesTypeService'
import ServicesTypeValidator from 'App/Validators/Services/ServicesTypeValidator'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServicesTypesController {
  public async index({ view }: HttpContextContract) {
    let columns: typeof ServicesType['columns'][number][] = ['id', 'slug', 'name']
    let servicesTypes: ServicesType[] = await ServicesTypeService.getAll(columns)

    return view.render('pages/servicesTypes/index', { servicesTypes })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/servicesTypes/create')
  }

  public async store({ request, session, response }: HttpContextContract) {
    let payload = await request.validate(ServicesTypeValidator)

    try {
      await ServicesTypeService.create(payload)

      session.flash('success', ResponseMessages.SERVICES_TYPES_CREATED)
      return response.redirect().toRoute('services_types.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  // public async show({}: HttpContextContract) {}

  public async edit({ params, view, session, response }: HttpContextContract) {
    let slug: ServicesType['slug'] = params.id

    try {
      let item: ServicesType = await ServicesTypeService.get(slug)

      return view.render('pages/servicesTypes/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, params, session, response }: HttpContextContract) {
    let slug: ServicesType['slug'] = params.id
    let payload = await request.validate(ServicesTypeValidator)

    try {
      await ServicesTypeService.update(slug, payload)

      session.flash('success', ResponseMessages.SERVICES_TYPES_UPDATED)
      return response.redirect().toRoute('services_types.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    let slug: ServicesType['slug'] = params.id

    try {
      await ServicesTypeService.delete(slug)

      session.flash('success', ResponseMessages.SERVICES_TYPES_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
