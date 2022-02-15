import ServicesType from 'App/Models/Services/ServicesType'
import ServicesTypeService from 'App/Services/Services/ServicesTypeService'
import ServicesTypeValidator from 'App/Validators/Services/ServicesTypeValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseMessages } from 'Contracts/response'

export default class ServicesTypesController {
  public async index({ view }: HttpContextContract) {
    let servicesTypes: ServicesType[] = await ServicesTypeService.getAll()

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
    let id: ServicesType['id'] = params.id

    try {
      let item: ServicesType = await ServicesTypeService.get({ column: 'id', val: id })

      return view.render('pages/servicesTypes/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, params, session, response }: HttpContextContract) {
    let id: ServicesType['id'] = params.id
    let payload = await request.validate(ServicesTypeValidator)

    try {
      await ServicesTypeService.update({ column: 'id', val: id }, payload)

      session.flash('success', ResponseMessages.SERVICES_TYPES_UPDATED)
      return response.redirect().toRoute('services_types.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    let id: ServicesType['id'] = params.id

    try {
      await ServicesTypeService.delete('id', id)

      session.flash('success', ResponseMessages.SERVICES_TYPES_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
