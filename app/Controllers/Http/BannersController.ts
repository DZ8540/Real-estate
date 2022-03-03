import Banner from 'App/Models/Banner'
import BannerService from 'App/Services/BannerService'
import BannerValidator from 'App/Validators/BannerValidator'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BannersController {
  public async index({ view }: HttpContextContract) {
    let banners: Banner[] = await BannerService.getAll()

    return view.render('pages/banners/index', { banners })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/banners/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    let payload = await request.validate(BannerValidator)

    try {
      await BannerService.create(payload)

      session.flash('success', ResponseMessages.BANNER_CREATED)
      return response.redirect().toRoute('banners.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  // public async show({}: HttpContextContract) {}

  public async edit({ view, response, params, session }: HttpContextContract) {
    let id: Banner['id'] = params.id

    try {
      let item: Banner = await BannerService.get(id)

      return view.render('pages/banners/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    let id: Banner['id'] = params.id
    let payload = await request.validate(BannerValidator)

    try {
      await BannerService.update(id, payload)

      session.flash('success', ResponseMessages.BANNER_UPDATED)
      return response.redirect().toRoute('banners.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ response, params, session }: HttpContextContract) {
    let id: Banner['id'] = params.id

    try {
      await BannerService.delete(id)

      session.flash('success', ResponseMessages.BANNER_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
