import News from 'App/Models/News'
import NewsService from 'App/Services/NewsService'
import NewsValidator from 'App/Validators/NewsValidator'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewsController {
  public async index({ view, route, request }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)
    let news: News[] = await NewsService.getAll({ baseURL, page })

    return view.render('pages/news/index', { news })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/news/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    let payload = await request.validate(NewsValidator)

    try {
      await NewsService.create(payload)

      session.flash('success', ResponseMessages.NEWS_CREATED)
      return response.redirect().toRoute('news.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, response, params, session }: HttpContextContract) {
    let id: News['id'] = params.id

    try {
      let item: News = await NewsService.get({ column: 'id', val: id })

      return view.render('pages/news/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ view, response, params, session }: HttpContextContract) {
    let id: News['id'] = params.id

    try {
      let item: News = await NewsService.get({ column: 'id', val: id })

      return view.render('pages/news/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    console.log('test')
    let id: News['id'] = params.id
    let payload = await request.validate(NewsValidator)

    try {
      await NewsService.update({ column: 'id', val: id }, payload)

      session.flash('success', ResponseMessages.NEWS_UPDATED)
      return response.redirect().toRoute('news.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ response, params, session }: HttpContextContract) {
    let id: News['id'] = params.id

    try {
      await NewsService.delete('id', id)

      session.flash('success', ResponseMessages.NEWS_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
