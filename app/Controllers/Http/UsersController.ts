import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'
import UserService from 'App/Services/UserService'
import User from 'App/Models/User'

export default class UsersController extends BaseController {
  public async index({ view, request, route }: HttpContextContract) {
    let page: number = request.input('page', 1)
    let users: User[] = await UserService.getAll({ page, baseURL: route!.pattern })

    return view.render('pages/users/index', { users })
  }

  public async show({ view, params, session, response }: HttpContextContract) {
    let id: number = params.id

    try {
      let item: User = await UserService.get(id)

      return view.render('pages/users/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async block({ response, params, session }: HttpContextContract) {
    let id: number = params.id

    try {
      await UserService.block(id)

      session.flash('success', 'Пользователь был успешно заблокирован!')
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unblock({ response, params, session }: HttpContextContract) {
    let id: number = params.id

    try {
      await UserService.unblock(id)

      session.flash('success', 'Пользователь был успешно разблокирован!')
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
