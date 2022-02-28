import UsersReview from 'App/Models/Users/UsersReview'
import UsersReviewService from 'App/Services/Users/UsersReviewService'
import UsersReviewValidator from 'App/Validators/Users/UsersReviewValidator'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersReviewsController {
  public async index({ view, route, request }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)
    let reviews: UsersReview[] = await UsersReviewService.paginate({ baseURL, page, relations: ['from', 'to'] })

    return view.render('pages/usersReviews/index', { reviews })
  }

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  public async show({ params, response, session, view }: HttpContextContract) {
    let id: UsersReview['id'] = params.id

    try {
      let item: UsersReview = await UsersReviewService.get(id, { relations: ['from', 'to'] })

      return view.render('pages/usersReviews/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ params, response, session, view }: HttpContextContract) {
    let id: UsersReview['id'] = params.id

    try {
      let item: UsersReview = await UsersReviewService.get(id, { relations: ['from', 'to'] })

      return view.render('pages/usersReviews/edit', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    let id: UsersReview['id'] = params.id
    let payload = await request.validate(UsersReviewValidator)

    try {
      await UsersReviewService.update(id, payload)

      session.flash('success', ResponseMessages.USERS_REVIEW_UPDATED)
      return response.redirect().toRoute('users_reviews.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    let id: UsersReview['id'] = params.id

    try {
      await UsersReviewService.delete(id)

      session.flash('success', ResponseMessages.USERS_REVIEW_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
