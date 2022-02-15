import Label from 'App/Models/Services/Label'
import LabelService from 'App/Services/Services/LabelService'
import LabelValidator from 'App/Validators/Services/LabelValidator'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LabelsController {
  public async index({ view, request, route }: HttpContextContract) {
    let page: number = request.input('page', 1)
    let baseURL: string = route!.pattern
    let labels: Label[] = await LabelService.getAll({ baseURL, page })

    return view.render('pages/labels/index', { labels })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/labels/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    let payload = await request.validate(LabelValidator)

    try {
      await LabelService.create(payload)

      session.flash('success', ResponseMessages.LABEL_CREATED)
      return response.redirect().toRoute('labels.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  // public async show({}: HttpContextContract) {}

  public async edit({ view, params, session, response }: HttpContextContract) {
    let id: Label['id'] = params.id

    try {
      let item: Label = await LabelService.get({ column: 'id', val: id })

      return view.render('pages/labels/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, session, response, params }: HttpContextContract) {
    let id: Label['id'] = params.id
    let payload = await request.validate(LabelValidator)

    try {
      await LabelService.update('id', id, payload)

      session.flash('success', ResponseMessages.LABEL_UPDATED)
      return response.redirect().toRoute('labels.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    let id: Label['id'] = params.id

    try {
      await LabelService.delete('id', id)

      session.flash('success', ResponseMessages.LABEL_DELETED)
      return response.redirect().toRoute('labels.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }
}
